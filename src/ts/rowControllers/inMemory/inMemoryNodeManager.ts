
import {RowNode} from "../../entities/rowNode";
import {Utils as _} from "../../utils";
import {GridOptionsWrapper} from "../../gridOptionsWrapper";
import {Context} from "../../context/context";
import {GetNodeChildDetails} from "../../entities/gridOptions";
import {EventService} from "../../eventService";

export class InMemoryNodeManager {

    private static TOP_LEVEL = 0;

    // Keep an index of existing nodes, so we can find them rapidly when
    // data updates come in.
    private nodeIndex: {
        [dataId: number]: {
            data: any,
            node: RowNode,
            ind: number
        }
    } = {};

    private rootNode: RowNode;
    private gridOptionsWrapper: GridOptionsWrapper;
    private context: Context;
    private eventService: EventService;

    private nextId = 0;

    private getNodeChildDetails: GetNodeChildDetails;
    private doesDataFlower: (data: any) => boolean;
    private suppressParentsInRowNodes: boolean;

    constructor(rootNode: RowNode, gridOptionsWrapper: GridOptionsWrapper, context: Context, eventService: EventService) {
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

    public setRowData(rowData: any[], firstId?: number): RowNode[] {

        this.rootNode.childrenAfterFilter = null;
        this.rootNode.childrenAfterGroup = null;
        this.rootNode.childrenAfterSort = null;
        this.rootNode.childrenMapped = null;

        this.nextId = _.exists(firstId) ? firstId : 0;

        if (!rowData) {
            this.rootNode.allLeafChildren = [];
            this.rootNode.childrenAfterGroup = [];
            return;
        }

        // func below doesn't have 'this' pointer, so need to pull out these bits
        this.getNodeChildDetails = this.gridOptionsWrapper.getNodeChildDetailsFunc();
        this.suppressParentsInRowNodes = this.gridOptionsWrapper.isSuppressParentsInRowNodes();
        this.doesDataFlower = this.gridOptionsWrapper.getDoesDataFlowerFunc();

        var rowsAlreadyGrouped = _.exists(this.getNodeChildDetails);

        // kick off recursion
        var result = this.recursiveFunction(rowData, null, InMemoryNodeManager.TOP_LEVEL);

        if (rowsAlreadyGrouped) {
            this.rootNode.childrenAfterGroup = result;
            this.setLeafChildren(this.rootNode);
        } else {
            this.rootNode.allLeafChildren = result;
        }
    }

    public updateRowData(rowData: any[]) {
        // This is intended to be called for observable data updates, where the data 
        // supplied is likely to be similar to the data we already have. Therefore,
        // it attempts to keep, wherever possible, the exsiting RowNodes, rather than
        // binning the whole lot and starting again.

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
        var currentPosition: number = 0;
        rowData.forEach((dataItem)=> {
            var node: RowNode = null;
            // If this is top leve, and our data item has a natural ID, re-use
            // existing nodes where possible.
            if (dataItem.hasOwnProperty('id')) {
                // Check for existing node.
                var indexEntry = this.nodeIndex[dataItem.id];
                if (indexEntry && indexEntry.data == dataItem) {
                    // Existing data, unchanged (requires it to be the SAME OBJECT).
                    node = indexEntry.node;
                    // Check its position in the array.
                    if (indexEntry.ind != currentPosition) {
                        _.removeFromArray(this.rootNode.allLeafChildren, node);
                        _.insertIntoArray(this.rootNode.allLeafChildren, node, currentPosition);
                        this.nodeIndex[dataItem.id].ind = currentPosition;
                    }
                } else if (indexEntry && indexEntry.data != dataItem) {
                    // Existing data, changed (or a different object representing
                    // the same data, not doing deep inspection here).
                    node = indexEntry.node;
                    this.nodeIndex[dataItem.id].data = dataItem;
                    node.setData(dataItem);
                    // Check its position in the array.
                    if (indexEntry.ind != currentPosition) {
                        _.removeFromArray(this.rootNode.allLeafChildren, node);
                        _.insertIntoArray(this.rootNode.allLeafChildren, node, currentPosition);
                        this.nodeIndex[dataItem.id].ind = currentPosition;
                    }
                } else {
                    // New data we haven't seen before.
                    node = this.createNode(dataItem, null, InMemoryNodeManager.TOP_LEVEL);
                    this.nodeIndex[dataItem.id] = {
                        data: dataItem,
                        node: node,
                        ind: currentPosition
                    };
                    // Insert it at the current position in the index.
                    _.insertIntoArray(this.rootNode.allLeafChildren, node, currentPosition);
                }
            } else {
                // No ID property, have to re-create every time.
                node = this.createNode(dataItem, null, InMemoryNodeManager.TOP_LEVEL);
                _.insertIntoArray(this.rootNode.allLeafChildren, node, currentPosition);
            }
            currentPosition++;
        });
    }
    

    private recursiveFunction(rowData: any[], parent: RowNode, level: number): RowNode[] {

        // make sure the rowData is an array and not a string of json - this was a commonly reported problem on the forum
        if (typeof rowData === 'string') {
            console.warn('ag-Grid: rowData must be an array, however you passed in a string. If you are loading JSON, make sure you convert the JSON string to JavaScript objects first');
            return;
        }

        var rowNodes: RowNode[] = [];
        rowData.forEach( (dataItem)=> {
            var node = this.createNode(dataItem, parent, level);

            var nodeChildDetails = this.getNodeChildDetails ? this.getNodeChildDetails(dataItem) : null;
            if (nodeChildDetails && nodeChildDetails.group) {
                node.group = true;
                node.childrenAfterGroup = this.recursiveFunction(nodeChildDetails.children, node, level + 1);
                node.expanded = nodeChildDetails.expanded === true;
                node.field = nodeChildDetails.field;
                node.key = nodeChildDetails.key;
                // pull out all the leaf children and add to our node
                this.setLeafChildren(node);
            }

            rowNodes.push(node);
        });
        return rowNodes;
    }

    private createNode(dataItem: any, parent: RowNode, level: number): RowNode {
        var node = new RowNode();
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
        } else {
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
    }

    private isExpanded(level: any) {
        let expandByDefault = this.gridOptionsWrapper.getGroupDefaultExpanded();
        if (expandByDefault===-1) {
            return true;
        } else {
            return level < expandByDefault;
        }
    }

    private setLeafChildren(node: RowNode): void {
        node.allLeafChildren = [];
        if (node.childrenAfterGroup) {
            node.childrenAfterGroup.forEach( childAfterGroup => {
                if (childAfterGroup.group) {
                    if (childAfterGroup.allLeafChildren) {
                        childAfterGroup.allLeafChildren.forEach( leafChild => node.allLeafChildren.push(leafChild) );
                    }
                } else {
                    node.allLeafChildren.push(childAfterGroup)
                }
            });
        }
    }

    public insertItemsAtIndex(index: number, rowData: any[]): RowNode[] {
        if (this.isRowsAlreadyGrouped()) { return null; }

        var nodeList = this.rootNode.allLeafChildren;

        if (index > nodeList.length) {
            console.warn(`ag-Grid: invalid index ${index}, max index is ${nodeList.length}`);
            return;
        }

        var newNodes: RowNode[] = [];
        // go through the items backwards, otherwise they get added in reverse order
        for (let i = rowData.length - 1; i >= 0; i--) {
            let data = rowData[i];
            let newNode = this.createNode(data, null, InMemoryNodeManager.TOP_LEVEL);
            _.insertIntoArray(nodeList, newNode, index);
            newNodes.push(newNode);
        }

        return newNodes.length > 0 ? newNodes : null;
    }

    public removeItems(rowNodes: RowNode[]): RowNode[] {
        if (this.isRowsAlreadyGrouped()) { return; }

        var nodeList = this.rootNode.allLeafChildren;

        var removedNodes: RowNode[] = [];
        rowNodes.forEach( rowNode => {
            var indexOfNode = nodeList.indexOf(rowNode);
            if (indexOfNode>=0) {
                rowNode.setSelected(false);
                nodeList.splice(indexOfNode, 1);
            }
            removedNodes.push(rowNode);
        });

        return removedNodes.length > 0 ? removedNodes : null;
    }

    public addItems(items: any): RowNode[] {
        var nodeList = this.rootNode.allLeafChildren;
        return this.insertItemsAtIndex(nodeList.length, items);
    }

    public isRowsAlreadyGrouped(): boolean {
        var rowsAlreadyGrouped = _.exists(this.gridOptionsWrapper.getNodeChildDetailsFunc());
        if (rowsAlreadyGrouped) {
            console.warn('ag-Grid: adding and removing rows is not supported when using nodeChildDetailsFunc, ie it is not ' +
                'supported if providing groups');
            return true;
        } else {
            return false;
        }
    }
}