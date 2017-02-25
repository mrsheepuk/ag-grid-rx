// Type definitions for ag-grid-rx v8.1.1
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Column } from "./column";
import { GridRow } from "./gridRow";
export interface GridCellDef {
    floating: string;
    rowIndex: number;
    column: Column;
}
export declare class GridCell {
    floating: string;
    rowIndex: number;
    column: Column;
    constructor(gridCellDef: GridCellDef);
    getGridCellDef(): GridCellDef;
    getGridRow(): GridRow;
    toString(): string;
    createId(): string;
}
