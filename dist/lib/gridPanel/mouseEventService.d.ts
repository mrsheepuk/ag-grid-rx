// Type definitions for ag-grid-rx v8.1.1
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { GridCell } from "../entities/gridCell";
import { RenderedCell } from "../rendering/renderedCell";
export declare class MouseEventService {
    private gridOptionsWrapper;
    getRenderedCellForEvent(event: MouseEvent | KeyboardEvent): RenderedCell;
    getGridCellForEvent(event: MouseEvent | KeyboardEvent): GridCell;
}
