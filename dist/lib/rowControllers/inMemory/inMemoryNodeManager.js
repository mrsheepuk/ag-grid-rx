/**
 * ag-grid-rx - Advanced Data Grid / Data Table with Observble rowData support (fork of ag-grid)
 * @version v8.0.1
 * @link https://github.com/mrsheepuk/ag-grid-rx
 * @license MIT
 */
"use strict";
var rowNode_1 = require("../../entities/rowNode");
var utils_1 = require("../../utils");
var InMemoryNodeManager = (function () {
    function InMemoryNodeManager(rootNode, gridOptionsWrapper, context, eventService) {
        // Keep an index of existing nodes, so we can find them rapidly when
        // data updates come in.
        this.nodeIndex = {};
        this.nextId = 0;
        this.rootNode = rootNode;
        this.gridOptionsWrapper = gridOptionsWrapper;
        this.context = context;
        this.eventService = eventService;
        this.rootNode.group = true;
        this.rootNode.level = -1;
        this.rootNode.allLeafChildren = [];
        this.rootNode.childrenAfterGroup = [];
        this.rootNode.childrenAfterSort = [];
        this.rootNode.childrenAfterFilter = [];
    }
    InMemoryNodeManager.prototype.setRowData = function (rowData, firstId) {
        this.rootNode.childrenAfterFilter = null;
        this.rootNode.childrenAfterGroup = null;
        this.rootNode.childrenAfterSort = null;
        this.rootNode.childrenMapped = null;
        this.nextId = utils_1.Utils.exists(firstId) ? firstId : 0;
        if (!rowData) {
            this.rootNode.allLeafChildren = [];
            this.rootNode.childrenAfterGroup = [];
            return;
        }
        // func below doesn't have 'this' pointer, so need to pull out these bits
        this.getNodeChildDetails = this.gridOptionsWrapper.getNodeChildDetailsFunc();
        this.suppressParentsInRowNodes = this.gridOptionsWrapper.isSuppressParentsInRowNodes();
        this.doesDataFlower = this.gridOptionsWrapper.getDoesDataFlowerFunc();
        var rowsAlreadyGrouped = utils_1.Utils.exists(this.getNodeChildDetails);
        // kick off recursion
        var result = this.recursiveFunction(rowData, null, InMemoryNodeManager.TOP_LEVEL);
        if (rowsAlreadyGrouped) {
            this.rootNode.childrenAfterGroup = result;
            this.setLeafChildren(this.rootNode);
        }
        else {
            this.rootNode.allLeafChildren = result;
        }
    };
    InMemoryNodeManager.prototype.updateRowData = function (rowData) {
        // This is intended to be called for observable data updates, where the data 
        // supplied is likely to be similar to the data we already have. Therefore,
        // it attempts to keep, wherever possible, the exsiting RowNodes, rather than
        // binning the whole lot and starting again.
        var _this = this;
        // Clear out the grouped / filtered / sorted views of the data, no simple way
        // to keep those.
        this.rootNode.childrenAfterFilter = null;
        this.rootNode.childrenAfterGroup = null;
        this.rootNode.childrenAfterSort = null;
        this.rootNode.childrenMapped = null;
        // We never reset nextId in here, so it should always strictly ascend as 
        // rownodes are created by createNode (unless we've got empty data, in 
        // which case we'll reset to zero).
        // this.nextId = 0;
        // If we have no rowData, reset everything.
        if (!rowData) {
            this.rootNode.allLeafChildren = [];
            this.rootNode.childrenAfterGroup = [];
            this.nextId = 0;
            return;
        }
        // Take our existing set of allLeafChildren, and update it with the
        // supplied rowData.
        var currentPosition = 0;
        rowData.forEach(function (dataItem) {
            var node = null;
            // If this is top leve, and our data item has a natural ID, re-use
            // existing nodes where possible.
            if (dataItem.hasOwnProperty('id')) {
                // Check for existing node.
                var indexEntry = _this.nodeIndex[dataItem.id];
                if (indexEntry && indexEntry.data == dataItem) {
                    // Existing data, unchanged (requires it to be the SAME OBJECT).
                    node = indexEntry.node;
                    // Check its position in the array.
                    if (indexEntry.ind != currentPosition) {
                        utils_1.Utils.removeFromArray(_this.rootNode.allLeafChildren, node);
                        utils_1.Utils.insertIntoArray(_this.rootNode.allLeafChildren, node, currentPosition);
                        _this.nodeIndex[dataItem.id].ind = currentPosition;
                    }
                }
                else if (indexEntry && indexEntry.data != dataItem) {
                    // Existing data, changed (or a different object representing
                    // the same data, not doing deep inspection here).
                    node = indexEntry.node;
                    _this.nodeIndex[dataItem.id].data = dataItem;
                    node.setData(dataItem);
                    // Check its position in the array.
                    if (indexEntry.ind != currentPosition) {
                        utils_1.Utils.removeFromArray(_this.rootNode.allLeafChildren, node);
                        utils_1.Utils.insertIntoArray(_this.rootNode.allLeafChildren, node, currentPosition);
                        _this.nodeIndex[dataItem.id].ind = currentPosition;
                    }
                }
                else {
                    // New data we haven't seen before.
                    node = _this.createNode(dataItem, null, InMemoryNodeManager.TOP_LEVEL);
                    _this.nodeIndex[dataItem.id] = {
                        data: dataItem,
                        node: node,
                        ind: currentPosition
                    };
                    // Insert it at the current position in the index.
                    utils_1.Utils.insertIntoArray(_this.rootNode.allLeafChildren, node, currentPosition);
                }
            }
            else {
                // No ID property, have to re-create every time.
                node = _this.createNode(dataItem, null, InMemoryNodeManager.TOP_LEVEL);
                utils_1.Utils.insertIntoArray(_this.rootNode.allLeafChildren, node, currentPosition);
            }
            currentPosition++;
        });
    };
    InMemoryNodeManager.prototype.recursiveFunction = function (rowData, parent, level) {
        var _this = this;
        // make sure the rowData is an array and not a string of json - this was a commonly reported problem on the forum
        if (typeof rowData === 'string') {
            console.warn('ag-Grid: rowData must be an array, however you passed in a string. If you are loading JSON, make sure you convert the JSON string to JavaScript objects first');
            return;
        }
        var rowNodes = [];
        rowData.forEach(function (dataItem) {
            var node = _this.createNode(dataItem, parent, level);
            var nodeChildDetails = _this.getNodeChildDetails ? _this.getNodeChildDetails(dataItem) : null;
            if (nodeChildDetails && nodeChildDetails.group) {
                node.group = true;
                node.childrenAfterGroup = _this.recursiveFunction(nodeChildDetails.children, node, level + 1);
                node.expanded = nodeChildDetails.expanded === true;
                node.field = nodeChildDetails.field;
                node.key = nodeChildDetails.key;
                // pull out all the leaf children and add to our node
                _this.setLeafChildren(node);
            }
            rowNodes.push(node);
        });
        return rowNodes;
    };
    InMemoryNodeManager.prototype.createNode = function (dataItem, parent, level) {
        var node = new rowNode_1.RowNode();
        this.context.wireBean(node);
        var nodeChildDetails = this.getNodeChildDetails ? this.getNodeChildDetails(dataItem) : null;
        if (nodeChildDetails && nodeChildDetails.group) {
            node.group = true;
            node.childrenAfterGroup = this.recursiveFunction(nodeChildDetails.children, node, level + 1);
            node.expanded = nodeChildDetails.expanded === true;
            node.field = nodeChildDetails.field;
            node.key = nodeChildDetails.key;
            node.canFlower = false;
            // pull out all the leaf children and add to our node
            this.setLeafChildren(node);
        }
        else {
            node.group = false;
            node.canFlower = this.doesDataFlower ? this.doesDataFlower(dataItem) : false;
            if (node.canFlower) {
                node.expanded = this.isExpanded(level);
            }
        }
        if (parent && !this.suppressParentsInRowNodes) {
            node.parent = parent;
        }
        node.level = level;
        node.setDataAndId(dataItem, this.nextId.toString());
        this.nextId++;
        return node;
    };
    InMemoryNodeManager.prototype.isExpanded = function (level) {
        var expandByDefault = this.gridOptionsWrapper.getGroupDefaultExpanded();
        if (expandByDefault === -1) {
            return true;
        }
        else {
            return level < expandByDefault;
        }
    };
    InMemoryNodeManager.prototype.setLeafChildren = function (node) {
        node.allLeafChildren = [];
        if (node.childrenAfterGroup) {
            node.childrenAfterGroup.forEach(function (childAfterGroup) {
                if (childAfterGroup.group) {
                    if (childAfterGroup.allLeafChildren) {
                        childAfterGroup.allLeafChildren.forEach(function (leafChild) { return node.allLeafChildren.push(leafChild); });
                    }
                }
                else {
                    node.allLeafChildren.push(childAfterGroup);
                }
            });
        }
    };
    InMemoryNodeManager.prototype.insertItemsAtIndex = function (index, rowData) {
        if (this.isRowsAlreadyGrouped()) {
            return null;
        }
        var nodeList = this.rootNode.allLeafChildren;
        if (index > nodeList.length) {
            console.warn("ag-Grid: invalid index " + index + ", max index is " + nodeList.length);
            return;
        }
        var newNodes = [];
        // go through the items backwards, otherwise they get added in reverse order
        for (var i = rowData.length - 1; i >= 0; i--) {
            var data = rowData[i];
            var newNode = this.createNode(data, null, InMemoryNodeManager.TOP_LEVEL);
            utils_1.Utils.insertIntoArray(nodeList, newNode, index);
            newNodes.push(newNode);
        }
        return newNodes.length > 0 ? newNodes : null;
    };
    InMemoryNodeManager.prototype.removeItems = function (rowNodes) {
        if (this.isRowsAlreadyGrouped()) {
            return;
        }
        var nodeList = this.rootNode.allLeafChildren;
        var removedNodes = [];
        rowNodes.forEach(function (rowNode) {
            var indexOfNode = nodeList.indexOf(rowNode);
            if (indexOfNode >= 0) {
                rowNode.setSelected(false);
                nodeList.splice(indexOfNode, 1);
            }
            removedNodes.push(rowNode);
        });
        return removedNodes.length > 0 ? removedNodes : null;
    };
    InMemoryNodeManager.prototype.addItems = function (items) {
        var nodeList = this.rootNode.allLeafChildren;
        return this.insertItemsAtIndex(nodeList.length, items);
    };
    InMemoryNodeManager.prototype.isRowsAlreadyGrouped = function () {
        var rowsAlreadyGrouped = utils_1.Utils.exists(this.gridOptionsWrapper.getNodeChildDetailsFunc());
        if (rowsAlreadyGrouped) {
            console.warn('ag-Grid: adding and removing rows is not supported when using nodeChildDetailsFunc, ie it is not ' +
                'supported if providing groups');
            return true;
        }
        else {
            return false;
        }
    };
    return InMemoryNodeManager;
}());
InMemoryNodeManager.TOP_LEVEL = 0;
exports.InMemoryNodeManager = InMemoryNodeManager;
