// Type definitions for ag-grid-rx v8.1.1
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Column } from "../entities/column";
import { RowNode } from "../entities/rowNode";
export declare class ValueFormatterService {
    private gridOptionsWrapper;
    formatValue(column: Column, rowNode: RowNode, $scope: any, rowIndex: number, value: any): string;
}
