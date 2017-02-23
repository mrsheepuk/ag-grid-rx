// Type definitions for ag-grid-rx v8.1.0
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Component } from "../widgets/component";
import { IFilterComp, IDoesFilterPassParams, IFilterParams } from "../interfaces/iFilter";
import { Context } from "../context/context";
export interface Comparator<T> {
    (left: T, right: T): number;
}
/**
 * T(ype) The type of this filter. ie in DateFilter T=Date
 * P(arams) The params that this filter can take
 * M(model getModel/setModel) The object that this filter serializes to
 *
 * Contains common logic to ALL filters.. Translation, apply and clear button
 * get/setModel context wiring....
 */
export declare abstract class BaseFilter<T, P extends IFilterParams, M> extends Component implements IFilterComp {
    static EQUALS: string;
    static NOT_EQUAL: string;
    static LESS_THAN: string;
    static LESS_THAN_OR_EQUAL: string;
    static GREATER_THAN: string;
    static GREATER_THAN_OR_EQUAL: string;
    static IN_RANGE: string;
    static CONTAINS: string;
    static NOT_CONTAINS: string;
    static STARTS_WITH: string;
    static ENDS_WITH: string;
    filterParams: P;
    clearActive: boolean;
    applyActive: boolean;
    private newRowsActionKeep;
    filter: string;
    private eButtonsPanel;
    private eApplyButton;
    private eClearButton;
    context: Context;
    private gridOptionsWrapper;
    init(params: P): void;
    onClearButton(): void;
    abstract isFilterActive(): boolean;
    abstract doesFilterPass(params: IDoesFilterPassParams): boolean;
    abstract bodyTemplate(): string;
    abstract resetState(): void;
    abstract serialize(): M;
    abstract parse(toParse: M): void;
    abstract refreshFilterBodyUi(): void;
    abstract initialiseFilterBodyUi(): void;
    onNewRowsLoaded(): void;
    getModel(): M;
    setModel(model: M): void;
    onFilterChanged(): void;
    generateFilterHeader(): string;
    private generateTemplate();
    translate(toTranslate: string): string;
}
/**
 * Every filter with a dropdown where the user can specify a comparing type against the filter values
 */
export declare abstract class ComparableBaseFilter<T, P extends IFilterParams, M> extends BaseFilter<T, P, M> {
    private eTypeSelector;
    abstract getApplicableFilterTypes(): string[];
    abstract filterValues(): T | T[];
    init(params: P): void;
    generateFilterHeader(): string;
    private onFilterTypeChanged();
    isFilterActive(): boolean;
    setFilterType(filterType: string): void;
}
/**
 * Comparable filter with scalar underlying values (ie numbers and dates. Strings are not scalar so have to extend
 * ComparableBaseFilter)
 */
export declare abstract class ScalarBaseFilter<T, P extends IFilterParams, M> extends ComparableBaseFilter<T, P, M> {
    abstract comparator(): Comparator<T>;
    doesFilterPass(params: IDoesFilterPassParams): boolean;
}
