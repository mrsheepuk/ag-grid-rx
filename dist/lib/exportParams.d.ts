// Type definitions for ag-grid-rx v8.0.1
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { ProcessCellForExportParams, ProcessHeaderForExportParams } from "./entities/gridOptions";
import { ColDef } from "./entities/colDef";
import { Column } from "./entities/column";
export interface ExportParams {
    skipHeader?: boolean;
    columnGroups?: boolean;
    skipFooters?: boolean;
    skipGroups?: boolean;
    skipFloatingTop?: boolean;
    skipFloatingBottom?: boolean;
    suppressQuotes?: boolean;
    columnKeys?: (Column | ColDef | string)[];
    fileName?: string;
    allColumns?: boolean;
    onlySelected?: boolean;
    onlySelectedAllPages?: boolean;
    processCellCallback?(params: ProcessCellForExportParams): string;
    processHeaderCallback?(params: ProcessHeaderForExportParams): string;
}
export interface CsvExportParams extends ExportParams {
    customHeader?: string;
    customFooter?: string;
    columnSeparator?: string;
}
