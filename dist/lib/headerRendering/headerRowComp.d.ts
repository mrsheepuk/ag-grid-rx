// Type definitions for ag-grid-rx v8.1.1-3
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Component } from "../widgets/component";
import { DropTarget } from "../dragAndDrop/dragAndDropService";
export declare enum HeaderRowType {
    COLUMN_GROUP = 0,
    COLUMN = 1,
    FLOATING_FILTER = 2,
}
export declare class HeaderRowComp extends Component {
    private gridOptionsWrapper;
    private columnController;
    private context;
    private eventService;
    private dept;
    private pinned;
    private headerElements;
    private eRoot;
    private dropTarget;
    private type;
    constructor(dept: number, type: HeaderRowType, pinned: string, eRoot: HTMLElement, dropTarget: DropTarget);
    forEachHeaderElement(callback: (comp: Component) => void): void;
    destroy(): void;
    private removeAndDestroyChildComponents(idsToDestroy);
    private onRowHeightChanged();
    private init();
    private onColumnResized();
    private setWidth();
    private onGridColumnsChanged();
    private removeAndDestroyAllChildComponents();
    private onDisplayedColumnsChanged();
    private onVirtualColumnsChanged();
    private isUsingOldHeaderRenderer(column);
    private createHeaderElement(columnGroupChild);
}
