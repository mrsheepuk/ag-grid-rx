// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { GridOptions } from "../entities/gridOptions";
import { GridApi } from "../gridApi";
import { ColumnApi } from "../columnController/columnController";
export declare class ComponentUtil {
    static EVENTS: string[];
    private static EVENT_CALLBACKS;
    static STRING_PROPERTIES: string[];
    static OBJECT_PROPERTIES: string[];
    static ARRAY_PROPERTIES: string[];
    static NUMBER_PROPERTIES: string[];
    static BOOLEAN_PROPERTIES: string[];
    static FUNCTION_PROPERTIES: string[];
    static ALL_PROPERTIES: string[];
    static getEventCallbacks(): string[];
    static copyAttributesToGridOptions(gridOptions: GridOptions, component: any): GridOptions;
    static getCallbackForEvent(eventName: string): string;
    static processOnChange(changes: any, gridOptions: GridOptions, api: GridApi, columnApi: ColumnApi): void;
    static toBoolean(value: any): boolean;
    static toNumber(value: any): number;
}
