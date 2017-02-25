// Type definitions for ag-grid-rx v8.1.1-3
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Component } from "../widgets/component";
export declare class HeaderRenderer {
    private gridOptionsWrapper;
    private columnController;
    private gridPanel;
    private context;
    private eventService;
    private scrollVisibleService;
    private pinnedLeftContainer;
    private pinnedRightContainer;
    private centerContainer;
    private childContainers;
    private eHeaderViewport;
    private eRoot;
    private eHeaderOverlay;
    private init();
    private onScrollVisibilityChanged();
    forEachHeaderElement(callback: (renderedHeaderElement: Component) => void): void;
    private destroy();
    private onGridColumnsChanged();
    refreshHeader(): void;
    private setHeight();
    setPinnedColContainerWidth(): void;
}
