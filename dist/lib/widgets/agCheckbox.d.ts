// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Component } from "./component";
export declare class AgCheckbox extends Component {
    static EVENT_CHANGED: string;
    private static TEMPLATE;
    private gridOptionsWrapper;
    private eChecked;
    private eUnchecked;
    private eIndeterminate;
    private eLabel;
    private selected;
    private readOnly;
    private passive;
    constructor();
    private postConstruct();
    attributesSet(): void;
    private loadIcons();
    private onClick();
    getNextValue(): boolean;
    setPassive(passive: boolean): void;
    setReadOnly(readOnly: boolean): void;
    isReadOnly(): boolean;
    isSelected(): boolean;
    toggle(): void;
    setSelected(selected: boolean): void;
    private updateIcons();
}
