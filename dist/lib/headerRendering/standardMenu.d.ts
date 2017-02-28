// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { IMenuFactory } from "../interfaces/iMenuFactory";
import { Column } from "../entities/column";
export declare class StandardMenuFactory implements IMenuFactory {
    private eventService;
    private filterManager;
    private popupService;
    private gridOptionsWrapper;
    showMenuAfterMouseEvent(column: Column, mouseEvent: MouseEvent | Touch): void;
    showMenuAfterButtonClick(column: Column, eventSource: HTMLElement): void;
    showPopup(column: Column, positionCallback: (eMenu: HTMLElement) => void): void;
    isMenuEnabled(column: Column): boolean;
}
