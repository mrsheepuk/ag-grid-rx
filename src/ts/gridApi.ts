import {Observable} from 'rxjs';

import {CsvCreator} from "./csvCreator";
import {RowRenderer} from "./rendering/rowRenderer";
import {HeaderRenderer} from "./headerRendering/headerRenderer";
import {FilterManager} from "./filter/filterManager";
import {ColumnController} from "./columnController/columnController";
import {SelectionController} from "./selectionController";
import {GridOptionsWrapper} from "./gridOptionsWrapper";
import {GridPanel} from "./gridPanel/gridPanel";
import {ValueService} from "./valueService";
import {MasterSlaveService} from "./masterSlaveService";
import {EventService} from "./eventService";
import {FloatingRowModel} from "./rowControllers/floatingRowModel";
import {ColDef, IAggFunc, ColGroupDef} from "./entities/colDef";
import {RowNode} from "./entities/rowNode";
import {Constants} from "./constants";
import {Column} from "./entities/column";
import {Bean, PostConstruct, Context, Autowired, Optional} from "./context/context";
import {GridCore} from "./gridCore";
import {IRowModel} from "./interfaces/iRowModel";
import {SortController} from "./sortController";
import {FocusedCellController} from "./focusedCellController";
import {GridCell, GridCellDef} from "./entities/gridCell";
import {IClipboardService} from "./interfaces/iClipboardService";
import {IInMemoryRowModel} from "./interfaces/iInMemoryRowModel";
import {Utils as _} from "./utils";
import {IMenuFactory} from "./interfaces/iMenuFactory";
import {CellRendererFactory} from "./rendering/cellRendererFactory";
import {CellEditorFactory} from "./rendering/cellEditorFactory";
import {IAggFuncService} from "./interfaces/iAggFuncService";
import {IFilter, IFilterComp} from "./interfaces/iFilter";
import {CsvExportParams} from "./exportParams";

export interface StartEditingCellParams {
    rowIndex: number;
    colKey: string|Column|ColDef;
    keyPress?: number;
    charPress?: string;
}

@Bean('gridApi')
export class GridApi {

    @Autowired('csvCreator') private csvCreator: CsvCreator;
    @Autowired('gridCore') private gridCore: GridCore;
    @Autowired('rowRenderer') private rowRenderer: RowRenderer;
    @Autowired('headerRenderer') private headerRenderer: HeaderRenderer;
    @Autowired('filterManager') private filterManager: FilterManager;
    @Autowired('columnController') private columnController: ColumnController;
    @Autowired('selectionController') private selectionController: SelectionController;
    @Autowired('gridOptionsWrapper') private gridOptionsWrapper: GridOptionsWrapper;
    @Autowired('gridPanel') private gridPanel: GridPanel;
    @Autowired('valueService') private valueService: ValueService;
    @Autowired('masterSlaveService') private masterSlaveService: MasterSlaveService;
    @Autowired('eventService') private eventService: EventService;
    @Autowired('floatingRowModel') private floatingRowModel: FloatingRowModel;
    @Autowired('context') private context: Context;
    @Autowired('rowModel') private rowModel: IRowModel;
    @Autowired('sortController') private sortController: SortController;
    @Autowired('focusedCellController') private focusedCellController: FocusedCellController;
    @Optional('clipboardService') private clipboardService: IClipboardService;
    @Optional('aggFuncService') private aggFuncService: IAggFuncService;
    @Autowired('menuFactory') private menuFactory: IMenuFactory;
    @Autowired('cellRendererFactory') private cellRendererFactory: CellRendererFactory;
    @Autowired('cellEditorFactory') private cellEditorFactory: CellEditorFactory;

    private inMemoryRowModel: IInMemoryRowModel;

    @PostConstruct
    private init(): void {
        this.inMemoryRowModel = <IInMemoryRowModel> this.rowModel;
    }

    /** Used internally by grid. Not intended to be used by the client. Interface may change between releases. */
    public __getMasterSlaveService(): MasterSlaveService {
        return this.masterSlaveService;
    }

    public getFirstRenderedRow(): number {
        return this.rowRenderer.getFirstVirtualRenderedRow();
    }

    public getLastRenderedRow(): number {
        return this.rowRenderer.getLastVirtualRenderedRow();
    }

    public getDataAsCsv(params?: CsvExportParams): string {
        return this.csvCreator.getDataAsCsv(params);
    }

    public exportDataAsCsv(params?: CsvExportParams): void {
        this.csvCreator.exportDataAsCsv(params)
    }

    public setRowData(rowData: Observable<any[]>) {
        if (this.gridOptionsWrapper.isRowModelDefault()) {
            this.selectionController.reset();
            this.inMemoryRowModel.setRowData(rowData);
        } else {
            console.log('cannot call setRowData unless using normal row model');
        }
    }

    public setFloatingTopRowData(rows: any[]): void {
        this.floatingRowModel.setFloatingTopRowData(rows);
    }

    public setFloatingBottomRowData(rows: any[]): void {
        this.floatingRowModel.setFloatingBottomRowData(rows);
    }

    public getFloatingTopRowCount(): number {
        return this.floatingRowModel.getFloatingTopRowCount();
    }

    public getFloatingBottomRowCount(): number {
        return this.floatingRowModel.getFloatingBottomRowCount();
    }

    public getFloatingTopRow(index: number): RowNode {
        return this.floatingRowModel.getFloatingTopRow(index);
    }

    public getFloatingBottomRow(index: number): RowNode {
        return this.floatingRowModel.getFloatingBottomRow(index);
    }

    public setColumnDefs(colDefs: (ColDef|ColGroupDef)[]) {
        this.columnController.setColumnDefs(colDefs);
    }

    public refreshRows(rowNodes: RowNode[]): void {
        this.rowRenderer.refreshRows(rowNodes);
    }

    public refreshCells(rowNodes: RowNode[], cols: (string|ColDef|Column)[], animate = false): void {
        this.rowRenderer.refreshCells(rowNodes, cols, animate);
    }

    public refreshView() {
        this.rowRenderer.refreshView();
    }

    public setFunctionsReadOnly(readOnly: boolean) {
        this.gridOptionsWrapper.setProperty('functionsReadOnly', readOnly);
    }

    public softRefreshView() {
        this.rowRenderer.softRefreshView();
    }

    public refreshGroupRows() {
        this.rowRenderer.refreshGroupRows();
    }

    public refreshHeader() {
        // need to review this - the refreshHeader should also refresh all icons in the header
        this.headerRenderer.refreshHeader();
    }

    public isAnyFilterPresent(): boolean {
        return this.filterManager.isAnyFilterPresent();
    }

    public isAdvancedFilterPresent(): boolean {
        return this.filterManager.isAdvancedFilterPresent();
    }

    public isQuickFilterPresent(): boolean {
        return this.filterManager.isQuickFilterPresent();
    }

    public getModel(): IRowModel {
        return this.rowModel;
    }

    public refreshInMemoryRowModel(): any {
        if (_.missing(this.inMemoryRowModel)) { console.log('cannot call refreshInMemoryRowModel unless using normal row model') }
        this.inMemoryRowModel.refreshModel({step: Constants.STEP_EVERYTHING});
    }
    
    public addRenderedRowListener(eventName: string, rowIndex: number, callback: Function) {
        if (eventName==='virtualRowRemoved') {
            console.log('ag-Grid: event virtualRowRemoved is deprecated, now called renderedRowRemoved');
            eventName = '' +
                '';
        }
        if (eventName==='virtualRowSelected') {
            console.log('ag-Grid: event virtualRowSelected is deprecated, to register for individual row ' +
                'selection events, add a listener directly to the row node.');
        }
        this.rowRenderer.addRenderedRowListener(eventName, rowIndex, callback);
    }

    public setQuickFilter(newFilter:any): void {
        this.filterManager.setQuickFilter(newFilter)
    }

    public selectAll() {
        this.selectionController.selectAllRowNodes();
    }

    public deselectAll() {
        this.selectionController.deselectAllRowNodes();
    }

    public selectAllFiltered() {
        this.selectionController.selectAllRowNodes(true);
    }

    public deselectAllFiltered() {
        this.selectionController.deselectAllRowNodes(true);
    }

    public recomputeAggregates(): void {
        if (_.missing(this.inMemoryRowModel)) { console.log('cannot call recomputeAggregates unless using normal row model') }
        this.inMemoryRowModel.refreshModel({step: Constants.STEP_AGGREGATE});
    }

    public sizeColumnsToFit() {
        if (this.gridOptionsWrapper.isForPrint()) {
            console.warn('ag-grid: sizeColumnsToFit does not work when forPrint=true');
            return;
        }
        this.gridPanel.sizeColumnsToFit();
    }

    public showLoadingOverlay(): void {
        this.gridPanel.showLoadingOverlay();
    }

    public showNoRowsOverlay(): void {
        this.gridPanel.showNoRowsOverlay();
    }

    public hideOverlay(): void {
        this.gridPanel.hideOverlay();
    }

    public getSelectedNodes(): RowNode[] {
        return this.selectionController.getSelectedNodes();
    }

    public getSelectedRows(): any[] {
        return this.selectionController.getSelectedRows();
    }

    public getBestCostNodeSelection() {
        return this.selectionController.getBestCostNodeSelection();
    }

    public getRenderedNodes() {
        return this.rowRenderer.getRenderedNodes();
    }

    public ensureColumnVisible(key: string|Column|ColDef) {
        this.gridPanel.ensureColumnVisible(key);
    }

    public ensureIndexVisible(index:any) {
        this.gridPanel.ensureIndexVisible(index);
    }

    public ensureNodeVisible(comparator:any) {
        this.gridCore.ensureNodeVisible(comparator);
    }

    public forEachLeafNode(callback: (rowNode: RowNode)=>void ) {
        if (_.missing(this.inMemoryRowModel)) { console.log('cannot call forEachNodeAfterFilter unless using normal row model') }
        this.inMemoryRowModel.forEachLeafNode(callback);
    }

    public forEachNode(callback: (rowNode: RowNode)=>void ) {
        this.rowModel.forEachNode(callback);
    }

    public forEachNodeAfterFilter(callback: (rowNode: RowNode)=>void) {
        if (_.missing(this.inMemoryRowModel)) { console.log('cannot call forEachNodeAfterFilter unless using normal row model') }
        this.inMemoryRowModel.forEachNodeAfterFilter(callback);
    }

    public forEachNodeAfterFilterAndSort(callback: (rowNode: RowNode)=>void) {
        if (_.missing(this.inMemoryRowModel)) { console.log('cannot call forEachNodeAfterFilterAndSort unless using normal row model') }
        this.inMemoryRowModel.forEachNodeAfterFilterAndSort(callback);
    }

    public getFilterInstance(key: string|Column|ColDef): IFilterComp {
        var column = this.columnController.getPrimaryColumn(key);
        if (column) {
            return this.filterManager.getFilterComponent(column);
        }
    }

    public destroyFilter(key: string|Column|ColDef) {
        var column = this.columnController.getPrimaryColumn(key);
        if (column) {
            return this.filterManager.destroyFilter(column);
        }
    }
    
    public getColumnDef(key: string|Column|ColDef) {
        var column = this.columnController.getPrimaryColumn(key);
        if (column) {
            return column.getColDef();
        } else {
            return null;
        }
    }

    public onFilterChanged() {
        this.filterManager.onFilterChanged();
    }

    public onSortChanged() {
        this.sortController.onSortChanged();
    }

    public setSortModel(sortModel:any) {
        this.sortController.setSortModel(sortModel);
    }

    public getSortModel() {
        return this.sortController.getSortModel();
    }

    public setFilterModel(model:any) {
        this.filterManager.setFilterModel(model);
    }

    public getFilterModel() {
        return this.filterManager.getFilterModel();
    }

    public getFocusedCell(): GridCell {
        return this.focusedCellController.getFocusedCell();
    }

    public clearFocusedCell(): void {
        return this.focusedCellController.clearFocusedCell();
    }

    public setFocusedCell(rowIndex: number, colKey: Column|ColDef|string, floating?: string) {
        this.focusedCellController.setFocusedCell(rowIndex, colKey, floating, true);
    }

    public setHeaderHeight(headerHeight: number) {
        this.gridOptionsWrapper.setProperty(GridOptionsWrapper.PROP_HEADER_HEIGHT, headerHeight);
    }

    public showToolPanel(show:any) {
        this.gridCore.showToolPanel(show);
    }

    public isToolPanelShowing() {
        return this.gridCore.isToolPanelShowing();
    }

    public doLayout() {
        this.gridCore.doLayout();
    }

    public resetRowHeights() {
        if (_.exists(this.inMemoryRowModel)) {
            this.inMemoryRowModel.resetRowHeights();
        }
    }

    public onRowHeightChanged() {
        if (_.exists(this.inMemoryRowModel)) {
            this.inMemoryRowModel.onRowHeightChanged();
        }
    }

    public getValue(colKey: string|ColDef|Column, rowNode: RowNode): any {
        var column = this.columnController.getPrimaryColumn(colKey);
        if (_.missing(column)) {
            column = this.columnController.getGridColumn(colKey);
        }
        if (_.missing(column)) {
            return null;
        } else {
            return this.valueService.getValue(column, rowNode);
        }
    }

    public addEventListener(eventType: string, listener: Function): void {
        this.eventService.addEventListener(eventType, listener);
    }

    public addGlobalListener(listener: Function): void {
        this.eventService.addGlobalListener(listener);
    }

    public removeEventListener(eventType: string, listener: Function): void {
        this.eventService.removeEventListener(eventType, listener);
    }

    public removeGlobalListener(listener: Function): void {
        this.eventService.removeGlobalListener(listener);
    }

    public dispatchEvent(eventType: string, event?: any): void {
        this.eventService.dispatchEvent(eventType, event);
    }

    public destroy(): void {
        this.context.destroy();
    }

    public resetQuickFilter(): void {
        this.rowModel.forEachNode( node => node.quickFilterAggregateText = null);
    }

    public showColumnMenuAfterButtonClick(colKey: string|Column|ColDef, buttonElement: HTMLElement): void {
        var column = this.columnController.getPrimaryColumn(colKey);
        this.menuFactory.showMenuAfterButtonClick(column, buttonElement);
    }

    public showColumnMenuAfterMouseClick(colKey: string|Column|ColDef, mouseEvent: MouseEvent|Touch): void {
        var column = this.columnController.getPrimaryColumn(colKey);
        this.menuFactory.showMenuAfterMouseEvent(column, mouseEvent);
    }

    public tabToNextCell(): boolean {
        return this.rowRenderer.tabToNextCell(false);
    }

    public tabToPreviousCell(): boolean {
        return this.rowRenderer.tabToNextCell(true);
    }

    public stopEditing(cancel: boolean = false): void {
        this.rowRenderer.stopEditing(cancel);
    }

    public startEditingCell(params: StartEditingCellParams): void {
        var column = this.columnController.getGridColumn(params.colKey);
        let gridCellDef = <GridCellDef> {rowIndex: params.rowIndex, floating: null, column: column};
        var gridCell = new GridCell(gridCellDef);
        this.rowRenderer.startEditingCell(gridCell, params.keyPress, params.charPress);
    }

    public addAggFunc(key: string, aggFunc: IAggFunc): void {
        if (this.aggFuncService) {
            this.aggFuncService.addAggFunc(key, aggFunc);
        }
    }

    public addAggFuncs(aggFuncs: {[key: string]: IAggFunc}): void {
        if (this.aggFuncService) {
            this.aggFuncService.addAggFuncs(aggFuncs);
        }
    }

    public clearAggFuncs(): void {
        if (this.aggFuncService) {
            this.aggFuncService.clear();
        }
    }

    public checkGridSize(): void {
        this.gridPanel.setBodyAndHeaderHeights();
    }
}
