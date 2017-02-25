// Type definitions for ag-grid-rx v8.1.1-3
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
export interface TextAndNumberFilterParameters {
    /** What to do when new rows are loaded. The default is to reset the filter, to keep it in line with 'set' filters. If you want to keep the selection, then set this value to 'keep'. */
    newRowsAction?: string;
}
