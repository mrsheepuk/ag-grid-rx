// Type definitions for ag-grid-rx v8.1.0
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { GridOptions } from "./entities/gridOptions";
import { IFrameworkFactory } from "./interfaces/iFrameworkFactory";
export interface GridParams {
    globalEventListener?: Function;
    $scope?: any;
    $compile?: any;
    quickFilterOnScope?: any;
    frameworkFactory?: IFrameworkFactory;
    seedBeanInstances?: {
        [key: string]: any;
    };
}
export declare class Grid {
    private context;
    private static enterpriseBeans;
    private static frameworkBeans;
    private static RowModelClasses;
    static setEnterpriseBeans(enterpriseBeans: any[], rowModelClasses: any): void;
    static setFrameworkBeans(frameworkBeans: any[]): void;
    constructor(eGridDiv: HTMLElement, gridOptions: GridOptions, params?: GridParams);
    private getRowModelClass(gridOptions);
    destroy(): void;
}
