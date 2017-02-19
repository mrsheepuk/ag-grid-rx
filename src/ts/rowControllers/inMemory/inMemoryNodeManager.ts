
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
            node: RowNode
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
        if (!rowData || rowData.length == 0) {
            this.rootNode.allLeafChildren = [];
            this.rootNode.childrenAfterGroup = [];
            this.nextId = 0;
            return;
        }

        var dataKeyProperty = this.gridOptionsWrapper.getRowDataKeyProperty();
        if (!_.exists(dataKeyProperty)) {
            console.error('ag-Grid-rx: rowDataKeyProperty must be specified in the options for ag-grid-rx.');
            return;
        }

        // Create a list of all keys in the index, we'll remove whatever is left
        // in this array after looping around our new data.
        let keysToRemove: any[] = Object.keys(this.nodeIndex);

        // Rebuild allLeafChildren using nodes from our index whenever we can.
        this.rootNode.allLeafChildren.length = 0;

        rowData.forEach((dataItem)=> {
            var node: RowNode = null;

            // If we've been given an item that doesn't have the required key property, 
            // log an error and disregard the item.
            if (!dataItem.hasOwnProperty(dataKeyProperty)) {
                console.error('ag-Grid-rx: every item of data passed to ag-grid-rx must have a property named the same as the rowDataKeyProperty option.');
                return;
            }

            let key = dataItem[dataKeyProperty];            
            // Check for existing node.
            var indexEntry = this.nodeIndex[key];

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
                    this.nodeIndex[key].data = dataItem;
                }
            } else {
                // No index entry, so create a new node and add it to the index.
                node = this.createNode(dataItem, InMemoryNodeManager.TOP_LEVEL);
                this.nodeIndex[key] = {
                    data: dataItem,
                    node: node
                };
            }

            this.rootNode.allLeafChildren.push(node);
        });

        // Tidy up our index with any removed items.
        keysToRemove.forEach((keyToRemove) => {
            delete this.nodeIndex[keyToRemove];
        });

        // As we're no longer doing grouping, just set rows after grouping equal
        // to our updated child leaf set.
        this.rootNode.childrenAfterGroup = this.rootNode.allLeafChildren;        
    }

    // private correctPositionIfNeeded(node: RowNode, key: any, desiredPosition: number) {
    //     if (this.nodeIndex[key].ind != desiredPosition) {
    //         _.removeFromArray(this.rootNode.allLeafChildren, node);
    //         _.insertIntoArray(this.rootNode.allLeafChildren, node, desiredPosition);
    //         this.nodeIndex[key].ind = desiredPosition;
    //     }
    // }

    private createNode(dataItem: any, level: number): RowNode {
        var node = new RowNode();
        this.context.wireBean(node);
        node.level = level;
        node.setDataAndId(dataItem, this.nextId.toString());

        this.nextId++;

        return node;
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
            let newNode = this.createNode(data, InMemoryNodeManager.TOP_LEVEL);
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
        // var rowsAlreadyGrouped = _.exists(this.gridOptionsWrapper.getNodeChildDetailsFunc());
        // if (rowsAlreadyGrouped) {
        //     console.warn('ag-Grid: adding and removing rows is not supported when using nodeChildDetailsFunc, ie it is not ' +
        //         'supported if providing groups');
        //     return true;
        // } else {
            return false;
        // }
    }
}