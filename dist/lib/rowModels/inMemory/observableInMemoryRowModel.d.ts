// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Observable } from 'rxjs';
import { RowNode } from "../../entities/rowNode";
import { IObservableInMemoryRowModel } from "../../interfaces/iObservableInMemoryRowModel";
export declare class ObservableInMemoryRowModel implements IObservableInMemoryRowModel {
    private gridOptionsWrapper;
    private columnController;
    private filterManager;
    private $scope;
    private selectionController;
    private eventService;
    private context;
    private filterStage;
    private sortStage;
    private flattenStage;
    private rootNode;
    private rowsToDisplay;
    private nodeManager;
    private rowDataSubscription;
    init(): void;
    destroy(): void;
    private onFilterChanged();
    private onSortChanged();
    getType(): string;
    private onValueChanged();
    refreshModel(params: {
        step: number;
        groupState?: any;
        keepRenderedRows?: boolean;
        animate?: boolean;
        keepEditingRows?: boolean;
        newRowNodes?: RowNode[];
    }): void;
    isEmpty(): boolean;
    isRowsToRender(): boolean;
    setDatasource(datasource: any): void;
    getTopLevelNodes(): RowNode[];
    getRootNode(): RowNode;
    getRow(index: number): RowNode;
    isRowPresent(rowNode: RowNode): boolean;
    getVirtualRowCount(): number;
    getRowCount(): number;
    getRowIndexAtPixel(pixelToMatch: number): number;
    private isRowInPixel(rowNode, pixelToMatch);
    getRowCombinedHeight(): number;
    forEachNode(callback: Function): void;
    forEachNodeAfterFilter(callback: Function): void;
    forEachNodeAfterFilterAndSort(callback: Function): void;
    private doSort();
    private doFilter();
    setRowDataSource(rowData: Observable<any[]>): void;
    private updateRowData(newData);
    private doRowsToDisplay();
    insertItemsAtIndex(index: number, items: any[], skipRefresh: boolean): void;
    onRowHeightChanged(): void;
    resetRowHeights(): void;
    removeItems(rowNodes: RowNode[], skipRefresh: boolean): void;
    addItems(items: any[], skipRefresh: boolean): void;
}
