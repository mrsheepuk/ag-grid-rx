// Type definitions for ag-grid-rx v8.0.3
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { RowNode } from "../../entities/rowNode";
import { GridOptionsWrapper } from "../../gridOptionsWrapper";
import { Context } from "../../context/context";
import { EventService } from "../../eventService";
export declare class InMemoryNodeManager {
    private static TOP_LEVEL;
    private nodeIndex;
    private rootNode;
    private gridOptionsWrapper;
    private context;
    private eventService;
    private nextId;
    private getNodeChildDetails;
    private doesDataFlower;
    private suppressParentsInRowNodes;
    constructor(rootNode: RowNode, gridOptionsWrapper: GridOptionsWrapper, context: Context, eventService: EventService);
    updateRowData(rowData: any[]): void;
    private createNode(dataItem, level);
    insertItemsAtIndex(index: number, rowData: any[]): RowNode[];
    removeItems(rowNodes: RowNode[]): RowNode[];
    addItems(items: any): RowNode[];
    isRowsAlreadyGrouped(): boolean;
}
