// Type definitions for ag-grid-rx v8.0.1
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { RowNode } from "../entities/rowNode";
export interface StageExecuteParams {
    rowNode: RowNode;
    newRowNodes?: RowNode[];
}
export interface IRowNodeStage {
    execute(params: StageExecuteParams): any;
}
