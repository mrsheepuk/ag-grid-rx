// Type definitions for ag-grid-rx v8.1.1
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { LoggerFactory } from "./logger";
export declare class GridCore {
    private gridOptions;
    private gridOptionsWrapper;
    private paginationController;
    private rowModel;
    private frameworkFactory;
    private columnController;
    private rowRenderer;
    private filterManager;
    private eventService;
    private gridPanel;
    private eGridDiv;
    private $scope;
    private quickFilterOnScope;
    private popupService;
    private focusedCellController;
    private rowGroupCompFactory;
    private pivotCompFactory;
    private toolPanel;
    private statusBar;
    private rowGroupComp;
    private pivotComp;
    private finished;
    private doingVirtualPaging;
    private eRootPanel;
    private toolPanelShowing;
    private logger;
    private destroyFunctions;
    constructor(loggerFactory: LoggerFactory);
    init(): void;
    private addRtlSupport();
    private createNorthPanel();
    private onDropPanelVisible();
    getRootGui(): HTMLElement;
    private createSouthPanel();
    private onRowGroupChanged();
    private addWindowResizeListener();
    private periodicallyDoLayout();
    showToolPanel(show: any): void;
    isToolPanelShowing(): boolean;
    private destroy();
    ensureNodeVisible(comparator: any): void;
    doLayout(): void;
}
