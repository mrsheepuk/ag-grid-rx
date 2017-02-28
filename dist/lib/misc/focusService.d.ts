// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
/** THIS IS NOT USED - it was something Niall was working on, but doesn't work well with popup editors */
export declare class FocusService {
    private gridCore;
    private columnController;
    private destroyMethods;
    private listeners;
    addListener(listener: (focusEvent: FocusEvent) => void): void;
    removeListener(listener: (focusEvent: FocusEvent) => void): void;
    private init();
    private onFocus(focusEvent);
    private getCellForFocus(focusEvent);
    private informListeners(event);
    private destroy();
}
