// Type definitions for ag-grid-rx v8.1.0
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { IFilterParams } from "../interfaces/iFilter";
import { Component } from "../widgets/component";
import { IDateParams, IDateComp } from "../rendering/dateComponent";
import { Comparator, ScalarBaseFilter } from "./baseFilter";
export interface IDateFilterParams extends IFilterParams {
    comparator?: IDateComparatorFunc;
}
export interface IDateComparatorFunc {
    (filterLocalDateAtMidnight: Date, cellValue: any): number;
}
export interface SerializedDateFilter {
    dateFrom: string;
    dateTo: string;
    type: string;
}
export declare class DateFilter extends ScalarBaseFilter<Date, IDateFilterParams, SerializedDateFilter> {
    private dateToComponent;
    private dateFromComponent;
    private componentProvider;
    private eDateFromPanel;
    private eDateToPanel;
    private dateFrom;
    private dateTo;
    getApplicableFilterTypes(): string[];
    bodyTemplate(): string;
    initialiseFilterBodyUi(): void;
    private onDateChanged();
    refreshFilterBodyUi(): void;
    comparator(): Comparator<Date>;
    private defaultComparator(filterDate, cellValue);
    serialize(): SerializedDateFilter;
    filterValues(): Date | Date[];
    getDateFrom(): string;
    getDateTo(): string;
    getFilterType(): string;
    setDateFrom(date: string): void;
    setDateTo(date: string): void;
    resetState(): void;
    parse(model: SerializedDateFilter): void;
    setType(filterType: string): void;
    private removeTimezone(from);
}
export declare class DefaultDateComponent extends Component implements IDateComp {
    private eDateInput;
    private listener;
    constructor();
    init(params: IDateParams): void;
    getDate(): Date;
    setDate(date: Date): void;
}
