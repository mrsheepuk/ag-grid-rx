// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { IFilterParams, IDoesFilterPassParams } from "../interfaces/iFilter";
import { ComparableBaseFilter } from "./baseFilter";
export interface SerializedTextFilter {
    filter: string;
    type: string;
}
export declare class TextFilter extends ComparableBaseFilter<string, IFilterParams, SerializedTextFilter> {
    private eFilterTextField;
    private filterText;
    getApplicableFilterTypes(): string[];
    bodyTemplate(): string;
    initialiseFilterBodyUi(): void;
    refreshFilterBodyUi(): void;
    afterGuiAttached(): void;
    filterValues(): string;
    doesFilterPass(params: IDoesFilterPassParams): boolean;
    private onFilterTextFieldChanged();
    setFilter(filter: string): void;
    getFilter(): string;
    resetState(): void;
    serialize(): SerializedTextFilter;
    parse(model: SerializedTextFilter): void;
    setType(filterType: string): void;
}
