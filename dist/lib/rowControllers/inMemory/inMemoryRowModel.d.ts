// Type definitions for ag-grid-rx v8.0.3
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Observable } from 'rxjs';
import { RowNode } from "../../entities/rowNode";
import { IInMemoryRowModel } from "../../interfaces/iInMemoryRowModel";
export declare class InMemoryRowModel implements IInMemoryRowModel {
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
    private groupStage;
    private aggregationStage;
    private pivotStage;
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
    forEachLeafNode(callback: Function): void;
    forEachNode(callback: Function): void;
    forEachNodeAfterFilter(callback: Function): void;
    forEachNodeAfterFilterAndSort(callback: Function): void;
    forEachPivotNode(callback: Function): void;
    private recursivelyWalkNodesAndCallback(nodes, callback, recursionType, index);
    doAggregate(): void;
    private doSort();
    private doRowGrouping(groupState, newRowNodes);
    private restoreGroupState(groupState);
    private doFilter();
    private doPivot();
    private getGroupState();
    setRowData(rowData: Observable<any[]>): void;
    private updateRowData(newData);
    private doRowsToDisplay();
    onRowHeightChanged(): void;
    resetRowHeights(): void;
}
