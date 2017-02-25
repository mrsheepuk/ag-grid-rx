// Type definitions for ag-grid-rx v8.1.1
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Column } from "../entities/column";
import { RowNode } from "../entities/rowNode";
export interface IContextMenuFactory {
    showMenu(node: RowNode, column: Column, value: any, mouseEvent: MouseEvent): void;
}
