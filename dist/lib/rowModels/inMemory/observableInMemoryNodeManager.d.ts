// Type definitions for ag-grid-rx v8.1.1-3
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { RowNode } from "../../entities/rowNode";
import { GridOptionsWrapper } from "../../gridOptionsWrapper";
import { Context } from "../../context/context";
import { EventService } from "../../eventService";
export declare class ObservableInMemoryNodeManager {
    private nodeIndex;
    private rootNode;
    private gridOptionsWrapper;
    private context;
    private eventService;
    private nextId;
    constructor(rootNode: RowNode, gridOptionsWrapper: GridOptionsWrapper, context: Context, eventService: EventService);
    updateRowData(rowData: any[]): void;
    private createNode(dataItem);
}
