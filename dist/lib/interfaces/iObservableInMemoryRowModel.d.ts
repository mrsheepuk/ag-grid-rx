// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Observable } from "rxjs";
import { IRowModel } from "./iRowModel";
export interface IObservableInMemoryRowModel extends IRowModel {
    /** ObservableInMemory model only. Gets the model to refresh. Provide a step for the
     * step in the pipeline you want to refresh from. */
    refreshModel(params: {
        step: number;
        groupState?: any;
        keepRenderedRows?: boolean;
        animate?: boolean;
    }): void;
    /** ObservableInMemory model only. */
    setRowDataSource(rows: Observable<any>): void;
    /** When the row height was changed for a row node */
    onRowHeightChanged(): void;
    /** When all row heights should be reset */
    resetRowHeights(): void;
}
