// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Column } from "../entities/column";
export interface IMenuFactory {
    showMenuAfterButtonClick(column: Column, eventSource: HTMLElement): void;
    showMenuAfterMouseEvent(column: Column, mouseEvent: MouseEvent | Touch): void;
    isMenuEnabled(column: Column): boolean;
}
