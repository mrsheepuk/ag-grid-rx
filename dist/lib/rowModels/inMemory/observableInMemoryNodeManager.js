/**
 * ag-grid-rx - Advanced Data Grid / Data Table with Observble rowData support (fork of ag-grid)
 * @version v8.1.1-3
 * @link https://github.com/mrsheepuk/ag-grid-rx
 * @license MIT
 */
"use strict";
var rowNode_1 = require("../../entities/rowNode");
var utils_1 = require("../../utils");
var ObservableInMemoryNodeManager = (function () {
    function ObservableInMemoryNodeManager(rootNode, gridOptionsWrapper, context, eventService) {
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
    ObservableInMemoryNodeManager.prototype.updateRowData = function (rowData) {
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
        if (!rowData || rowData.length == 0) {
            this.rootNode.allLeafChildren = [];
            this.rootNode.childrenAfterGroup = [];
            this.nextId = 0;
            this.nodeIndex = {};
            return;
        }
        var dataKeyProperty = this.gridOptionsWrapper.getRowDataSourceKeyProperty();
        if (!utils_1.Utils.exists(dataKeyProperty)) {
            console.error('ag-Grid-rx: rowDataSourceKeyProperty must be specified in the options for ag-grid-rx.');
            return;
        }
        // Create a list of all keys in the index, we'll remove whatever is left
        // in this array after looping around our new data.
        var keysToRemove = Object.keys(this.nodeIndex);
        // Rebuild allLeafChildren using nodes from our index whenever we can.
        this.rootNode.allLeafChildren.length = 0;
        rowData.forEach(function (dataItem) {
            var node = null;
            // If we've been given an item that doesn't have the required key property, 
            // log an error and disregard the item.
            if (!dataItem.hasOwnProperty(dataKeyProperty)) {
                console.error('ag-Grid-rx: every item of data passed to ag-grid-rx must have a property named the same as the rowDataKeyProperty option.');
                return;
            }
            var key = dataItem[dataKeyProperty];
            // Check for existing node.
            var indexEntry = _this.nodeIndex[key];
            if (indexEntry) {
                // We have an existing node, start with that.
                node = indexEntry.node;
                // Don't want to remove this entry from the index.
                keysToRemove.splice(keysToRemove.indexOf(key), 1);
                // If the data object has changed, re-set the data on the node.
                // This assumes that the objects are being passed are immutable,
                // so we can avoid updating the data if the object is the same
                // object we had previously. This will only be true if the 
                // end user is using NgRx, Redux, being careful, or getting a 
                // passing a full new set of data every time!
                if (indexEntry.data != dataItem) {
                    node.setData(dataItem);
                    _this.nodeIndex[key].data = dataItem;
                }
            }
            else {
                // No index entry, so create a new node and add it to the index.
                node = _this.createNode(dataItem);
                _this.nodeIndex[key] = {
                    data: dataItem,
                    node: node
                };
            }
            _this.rootNode.allLeafChildren.push(node);
        });
        // Tidy up our index with any removed items.
        keysToRemove.forEach(function (keyToRemove) {
            delete _this.nodeIndex[keyToRemove];
        });
        // As we're no longer doing grouping, just set rows after grouping equal
        // to our updated child leaf set.
        this.rootNode.childrenAfterGroup = this.rootNode.allLeafChildren;
    };
    ObservableInMemoryNodeManager.prototype.createNode = function (dataItem) {
        var node = new rowNode_1.RowNode();
        this.context.wireBean(node);
        node.level = 0;
        node.setDataAndId(dataItem, this.nextId.toString());
        this.nextId++;
        return node;
    };
    return ObservableInMemoryNodeManager;
}());
exports.ObservableInMemoryNodeManager = ObservableInMemoryNodeManager;
