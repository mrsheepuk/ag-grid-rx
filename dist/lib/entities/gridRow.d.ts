// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { GridCell } from "./gridCell";
import { Column } from "./column";
export declare class GridRow {
    floating: string;
    rowIndex: number;
    constructor(rowIndex: number, floating: string);
    isFloatingTop(): boolean;
    isFloatingBottom(): boolean;
    isNotFloating(): boolean;
    equals(otherSelection: GridRow): boolean;
    toString(): string;
    getGridCell(column: Column): GridCell;
    before(otherSelection: GridRow): boolean;
}
