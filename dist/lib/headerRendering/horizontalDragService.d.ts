// Type definitions for ag-grid-rx v8.1.0
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
/** need to get this class to use the dragService, so no duplication */
export interface DragServiceParams {
    eDraggableElement: Element;
    eBody: HTMLElement;
    cursor: string;
    startAfterPixels: number;
    onDragStart: (event?: MouseEvent) => void;
    onDragging: (delta: number, finished: boolean) => void;
}
export declare class HorizontalDragService {
    private gridOptionsWrapper;
    addDragHandling(params: DragServiceParams): void;
}
