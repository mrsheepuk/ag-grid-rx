// Type definitions for ag-grid-rx v8.1.0
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Column } from "../entities/column";
import { BeanStub } from "../context/beanStub";
export declare class ColumnHoverService extends BeanStub {
    private eventService;
    private currentlySelectedColumn;
    private init();
    private onCellMouseOver(cellEvent);
    private onCellMouseOut();
    isHovered(column: Column): boolean;
}
