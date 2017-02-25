// Type definitions for ag-grid-rx v8.1.1-3
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { IFilterParams } from "../interfaces/iFilter";
import { Comparator, ScalarBaseFilter } from "./baseFilter";
export interface SerializedNumberFilter {
    filter: number;
    filterTo: number;
    type: string;
}
export declare class NumberFilter extends ScalarBaseFilter<number, IFilterParams, SerializedNumberFilter> {
    static EQUALS: string;
    static NOT_EQUAL: string;
    static LESS_THAN: string;
    static LESS_THAN_OR_EQUAL: string;
    static GREATER_THAN: string;
    static GREATER_THAN_OR_EQUAL: string;
    static IN_RANGE: string;
    private eNumberToPanel;
    private filterNumber;
    private filterNumberTo;
    private eFilterToTextField;
    private eFilterTextField;
    getApplicableFilterTypes(): string[];
    bodyTemplate(): string;
    initialiseFilterBodyUi(): void;
    afterGuiAttached(): void;
    comparator(): Comparator<number>;
    private onTextFieldsChanged();
    filterValues(): number | number[];
    private stringToFloat(value);
    setFilter(filter: any): void;
    setFilterTo(filter: any): void;
    getFilter(): any;
    serialize(): SerializedNumberFilter;
    parse(model: SerializedNumberFilter): void;
    refreshFilterBodyUi(): void;
    resetState(): void;
    setType(filterType: string): void;
}
