// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Component } from "../../widgets/component";
import { ICellEditorComp, ICellEditorParams } from "./iCellEditor";
export declare class TextCellEditor extends Component implements ICellEditorComp {
    private static TEMPLATE;
    private highlightAllOnFocus;
    private focusAfterAttached;
    constructor();
    init(params: ICellEditorParams): void;
    afterGuiAttached(): void;
    focusIn(): void;
    getValue(): any;
}
