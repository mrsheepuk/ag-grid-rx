// Type definitions for ag-grid-rx v8.0.3
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { IFilterParams, IDoesFilterPassParams, IFilterComp } from "../interfaces/iFilter";
export declare class TextFilter implements IFilterComp {
    static CONTAINS: string;
    static NOT_CONTAINS: string;
    static EQUALS: string;
    static NOT_EQUALS: string;
    static STARTS_WITH: string;
    static ENDS_WITH: string;
    private filterParams;
    private gridOptionsWrapper;
    private filterText;
    private filterType;
    private applyActive;
    private newRowsActionKeep;
    private eGui;
    private eFilterTextField;
    private eTypeSelect;
    private eApplyButton;
    init(params: IFilterParams): void;
    onNewRowsLoaded(): void;
    afterGuiAttached(): void;
    doesFilterPass(params: IDoesFilterPassParams): boolean;
    getGui(): HTMLElement;
    isFilterActive(): boolean;
    private createTemplate();
    private createGui();
    private setupApply();
    private onTypeChanged();
    private onFilterChanged();
    private filterChanged();
    setType(type: string): void;
    setFilter(filter: string): void;
    getType(): string;
    getFilter(): string;
    getModel(): any;
    setModel(model: any): void;
}
