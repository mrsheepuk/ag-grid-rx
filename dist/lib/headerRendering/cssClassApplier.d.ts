// Type definitions for ag-grid-rx v8.1.1
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { AbstractColDef } from "../entities/colDef";
import { GridOptionsWrapper } from "../gridOptionsWrapper";
import { ColumnGroup } from "../entities/columnGroup";
import { Column } from "../entities/column";
import { OriginalColumnGroup } from "../entities/originalColumnGroup";
export declare class CssClassApplier {
    static addHeaderClassesFromColDef(abstractColDef: AbstractColDef, eHeaderCell: HTMLElement, gridOptionsWrapper: GridOptionsWrapper, column: Column, columnGroup: ColumnGroup): void;
    static addToolPanelClassesFromColDef(abstractColDef: AbstractColDef, eHeaderCell: HTMLElement, gridOptionsWrapper: GridOptionsWrapper, column: Column, columnGroup: OriginalColumnGroup): void;
    static addColumnClassesFromCollDef(classesOrFunc: string | string[] | ((params: any) => string | string[]), abstractColDef: AbstractColDef, eHeaderCell: HTMLElement, gridOptionsWrapper: GridOptionsWrapper, column: Column, columnGroup: ColumnGroup | OriginalColumnGroup): void;
}
