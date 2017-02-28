// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { ICellRenderer } from "./iCellRenderer";
import { Component } from "../../widgets/component";
export declare class AnimateSlideCellRenderer extends Component implements ICellRenderer {
    private static TEMPLATE;
    private params;
    private eCurrent;
    private ePrevious;
    private lastValue;
    private refreshCount;
    constructor();
    init(params: any): void;
    addSlideAnimation(): void;
    refresh(params: any): void;
}
