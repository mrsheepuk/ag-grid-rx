/**
 * ag-grid-rx - Advanced Data Grid / Data Table with Observble rowData support (fork of ag-grid)
 * @version v8.0.3
 * @link https://github.com/mrsheepuk/ag-grid-rx
 * @license MIT
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var csvCreator_1 = require("./csvCreator");
var rowRenderer_1 = require("./rendering/rowRenderer");
var headerRenderer_1 = require("./headerRendering/headerRenderer");
var filterManager_1 = require("./filter/filterManager");
var columnController_1 = require("./columnController/columnController");
var selectionController_1 = require("./selectionController");
var gridOptionsWrapper_1 = require("./gridOptionsWrapper");
var gridPanel_1 = require("./gridPanel/gridPanel");
var valueService_1 = require("./valueService");
var masterSlaveService_1 = require("./masterSlaveService");
var eventService_1 = require("./eventService");
var floatingRowModel_1 = require("./rowControllers/floatingRowModel");
var constants_1 = require("./constants");
var context_1 = require("./context/context");
var gridCore_1 = require("./gridCore");
var sortController_1 = require("./sortController");
var focusedCellController_1 = require("./focusedCellController");
var gridCell_1 = require("./entities/gridCell");
var utils_1 = require("./utils");
var cellRendererFactory_1 = require("./rendering/cellRendererFactory");
var cellEditorFactory_1 = require("./rendering/cellEditorFactory");
var GridApi = (function () {
    function GridApi() {
    }
    GridApi.prototype.init = function () {
        this.inMemoryRowModel = this.rowModel;
    };
    /** Used internally by grid. Not intended to be used by the client. Interface may change between releases. */
    GridApi.prototype.__getMasterSlaveService = function () {
        return this.masterSlaveService;
    };
    GridApi.prototype.getFirstRenderedRow = function () {
        return this.rowRenderer.getFirstVirtualRenderedRow();
    };
    GridApi.prototype.getLastRenderedRow = function () {
        return this.rowRenderer.getLastVirtualRenderedRow();
    };
    GridApi.prototype.getDataAsCsv = function (params) {
        return this.csvCreator.getDataAsCsv(params);
    };
    GridApi.prototype.exportDataAsCsv = function (params) {
        this.csvCreator.exportDataAsCsv(params);
    };
    GridApi.prototype.setRowData = function (rowData) {
        if (this.gridOptionsWrapper.isRowModelDefault()) {
            this.selectionController.reset();
            this.inMemoryRowModel.setRowData(rowData);
        }
        else {
            console.log('cannot call setRowData unless using normal row model');
        }
    };
    GridApi.prototype.setFloatingTopRowData = function (rows) {
        this.floatingRowModel.setFloatingTopRowData(rows);
    };
    GridApi.prototype.setFloatingBottomRowData = function (rows) {
        this.floatingRowModel.setFloatingBottomRowData(rows);
    };
    GridApi.prototype.getFloatingTopRowCount = function () {
        return this.floatingRowModel.getFloatingTopRowCount();
    };
    GridApi.prototype.getFloatingBottomRowCount = function () {
        return this.floatingRowModel.getFloatingBottomRowCount();
    };
    GridApi.prototype.getFloatingTopRow = function (index) {
        return this.floatingRowModel.getFloatingTopRow(index);
    };
    GridApi.prototype.getFloatingBottomRow = function (index) {
        return this.floatingRowModel.getFloatingBottomRow(index);
    };
    GridApi.prototype.setColumnDefs = function (colDefs) {
        this.columnController.setColumnDefs(colDefs);
    };
    GridApi.prototype.refreshRows = function (rowNodes) {
        this.rowRenderer.refreshRows(rowNodes);
    };
    GridApi.prototype.refreshCells = function (rowNodes, cols, animate) {
        if (animate === void 0) { animate = false; }
        this.rowRenderer.refreshCells(rowNodes, cols, animate);
    };
    GridApi.prototype.refreshView = function () {
        this.rowRenderer.refreshView();
    };
    GridApi.prototype.setFunctionsReadOnly = function (readOnly) {
        this.gridOptionsWrapper.setProperty('functionsReadOnly', readOnly);
    };
    GridApi.prototype.softRefreshView = function () {
        this.rowRenderer.softRefreshView();
    };
    GridApi.prototype.refreshGroupRows = function () {
        this.rowRenderer.refreshGroupRows();
    };
    GridApi.prototype.refreshHeader = function () {
        // need to review this - the refreshHeader should also refresh all icons in the header
        this.headerRenderer.refreshHeader();
    };
    GridApi.prototype.isAnyFilterPresent = function () {
        return this.filterManager.isAnyFilterPresent();
    };
    GridApi.prototype.isAdvancedFilterPresent = function () {
        return this.filterManager.isAdvancedFilterPresent();
    };
    GridApi.prototype.isQuickFilterPresent = function () {
        return this.filterManager.isQuickFilterPresent();
    };
    GridApi.prototype.getModel = function () {
        return this.rowModel;
    };
    GridApi.prototype.refreshInMemoryRowModel = function () {
        if (utils_1.Utils.missing(this.inMemoryRowModel)) {
            console.log('cannot call refreshInMemoryRowModel unless using normal row model');
        }
        this.inMemoryRowModel.refreshModel({ step: constants_1.Constants.STEP_EVERYTHING });
    };
    GridApi.prototype.addRenderedRowListener = function (eventName, rowIndex, callback) {
        if (eventName === 'virtualRowRemoved') {
            console.log('ag-Grid: event virtualRowRemoved is deprecated, now called renderedRowRemoved');
            eventName = '' +
                '';
        }
        if (eventName === 'virtualRowSelected') {
            console.log('ag-Grid: event virtualRowSelected is deprecated, to register for individual row ' +
                'selection events, add a listener directly to the row node.');
        }
        this.rowRenderer.addRenderedRowListener(eventName, rowIndex, callback);
    };
    GridApi.prototype.setQuickFilter = function (newFilter) {
        this.filterManager.setQuickFilter(newFilter);
    };
    GridApi.prototype.selectAll = function () {
        this.selectionController.selectAllRowNodes();
    };
    GridApi.prototype.deselectAll = function () {
        this.selectionController.deselectAllRowNodes();
    };
    GridApi.prototype.selectAllFiltered = function () {
        this.selectionController.selectAllRowNodes(true);
    };
    GridApi.prototype.deselectAllFiltered = function () {
        this.selectionController.deselectAllRowNodes(true);
    };
    GridApi.prototype.recomputeAggregates = function () {
        if (utils_1.Utils.missing(this.inMemoryRowModel)) {
            console.log('cannot call recomputeAggregates unless using normal row model');
        }
        this.inMemoryRowModel.refreshModel({ step: constants_1.Constants.STEP_AGGREGATE });
    };
    GridApi.prototype.sizeColumnsToFit = function () {
        if (this.gridOptionsWrapper.isForPrint()) {
            console.warn('ag-grid: sizeColumnsToFit does not work when forPrint=true');
            return;
        }
        this.gridPanel.sizeColumnsToFit();
    };
    GridApi.prototype.showLoadingOverlay = function () {
        this.gridPanel.showLoadingOverlay();
    };
    GridApi.prototype.showNoRowsOverlay = function () {
        this.gridPanel.showNoRowsOverlay();
    };
    GridApi.prototype.hideOverlay = function () {
        this.gridPanel.hideOverlay();
    };
    GridApi.prototype.getSelectedNodes = function () {
        return this.selectionController.getSelectedNodes();
    };
    GridApi.prototype.getSelectedRows = function () {
        return this.selectionController.getSelectedRows();
    };
    GridApi.prototype.getBestCostNodeSelection = function () {
        return this.selectionController.getBestCostNodeSelection();
    };
    GridApi.prototype.getRenderedNodes = function () {
        return this.rowRenderer.getRenderedNodes();
    };
    GridApi.prototype.ensureColumnVisible = function (key) {
        this.gridPanel.ensureColumnVisible(key);
    };
    GridApi.prototype.ensureIndexVisible = function (index) {
        this.gridPanel.ensureIndexVisible(index);
    };
    GridApi.prototype.ensureNodeVisible = function (comparator) {
        this.gridCore.ensureNodeVisible(comparator);
    };
    GridApi.prototype.forEachLeafNode = function (callback) {
        if (utils_1.Utils.missing(this.inMemoryRowModel)) {
            console.log('cannot call forEachNodeAfterFilter unless using normal row model');
        }
        this.inMemoryRowModel.forEachLeafNode(callback);
    };
    GridApi.prototype.forEachNode = function (callback) {
        this.rowModel.forEachNode(callback);
    };
    GridApi.prototype.forEachNodeAfterFilter = function (callback) {
        if (utils_1.Utils.missing(this.inMemoryRowModel)) {
            console.log('cannot call forEachNodeAfterFilter unless using normal row model');
        }
        this.inMemoryRowModel.forEachNodeAfterFilter(callback);
    };
    GridApi.prototype.forEachNodeAfterFilterAndSort = function (callback) {
        if (utils_1.Utils.missing(this.inMemoryRowModel)) {
            console.log('cannot call forEachNodeAfterFilterAndSort unless using normal row model');
        }
        this.inMemoryRowModel.forEachNodeAfterFilterAndSort(callback);
    };
    GridApi.prototype.getFilterInstance = function (key) {
        var column = this.columnController.getPrimaryColumn(key);
        if (column) {
            return this.filterManager.getFilterComponent(column);
        }
    };
    GridApi.prototype.destroyFilter = function (key) {
        var column = this.columnController.getPrimaryColumn(key);
        if (column) {
            return this.filterManager.destroyFilter(column);
        }
    };
    GridApi.prototype.getColumnDef = function (key) {
        var column = this.columnController.getPrimaryColumn(key);
        if (column) {
            return column.getColDef();
        }
        else {
            return null;
        }
    };
    GridApi.prototype.onFilterChanged = function () {
        this.filterManager.onFilterChanged();
    };
    GridApi.prototype.onSortChanged = function () {
        this.sortController.onSortChanged();
    };
    GridApi.prototype.setSortModel = function (sortModel) {
        this.sortController.setSortModel(sortModel);
    };
    GridApi.prototype.getSortModel = function () {
        return this.sortController.getSortModel();
    };
    GridApi.prototype.setFilterModel = function (model) {
        this.filterManager.setFilterModel(model);
    };
    GridApi.prototype.getFilterModel = function () {
        return this.filterManager.getFilterModel();
    };
    GridApi.prototype.getFocusedCell = function () {
        return this.focusedCellController.getFocusedCell();
    };
    GridApi.prototype.clearFocusedCell = function () {
        return this.focusedCellController.clearFocusedCell();
    };
    GridApi.prototype.setFocusedCell = function (rowIndex, colKey, floating) {
        this.focusedCellController.setFocusedCell(rowIndex, colKey, floating, true);
    };
    GridApi.prototype.setHeaderHeight = function (headerHeight) {
        this.gridOptionsWrapper.setProperty(gridOptionsWrapper_1.GridOptionsWrapper.PROP_HEADER_HEIGHT, headerHeight);
    };
    GridApi.prototype.showToolPanel = function (show) {
        this.gridCore.showToolPanel(show);
    };
    GridApi.prototype.isToolPanelShowing = function () {
        return this.gridCore.isToolPanelShowing();
    };
    GridApi.prototype.doLayout = function () {
        this.gridCore.doLayout();
    };
    GridApi.prototype.resetRowHeights = function () {
        if (utils_1.Utils.exists(this.inMemoryRowModel)) {
            this.inMemoryRowModel.resetRowHeights();
        }
    };
    GridApi.prototype.onRowHeightChanged = function () {
        if (utils_1.Utils.exists(this.inMemoryRowModel)) {
            this.inMemoryRowModel.onRowHeightChanged();
        }
    };
    GridApi.prototype.getValue = function (colKey, rowNode) {
        var column = this.columnController.getPrimaryColumn(colKey);
        if (utils_1.Utils.missing(column)) {
            column = this.columnController.getGridColumn(colKey);
        }
        if (utils_1.Utils.missing(column)) {
            return null;
        }
        else {
            return this.valueService.getValue(column, rowNode);
        }
    };
    GridApi.prototype.addEventListener = function (eventType, listener) {
        this.eventService.addEventListener(eventType, listener);
    };
    GridApi.prototype.addGlobalListener = function (listener) {
        this.eventService.addGlobalListener(listener);
    };
    GridApi.prototype.removeEventListener = function (eventType, listener) {
        this.eventService.removeEventListener(eventType, listener);
    };
    GridApi.prototype.removeGlobalListener = function (listener) {
        this.eventService.removeGlobalListener(listener);
    };
    GridApi.prototype.dispatchEvent = function (eventType, event) {
        this.eventService.dispatchEvent(eventType, event);
    };
    GridApi.prototype.destroy = function () {
        this.context.destroy();
    };
    GridApi.prototype.resetQuickFilter = function () {
        this.rowModel.forEachNode(function (node) { return node.quickFilterAggregateText = null; });
    };
    GridApi.prototype.showColumnMenuAfterButtonClick = function (colKey, buttonElement) {
        var column = this.columnController.getPrimaryColumn(colKey);
        this.menuFactory.showMenuAfterButtonClick(column, buttonElement);
    };
    GridApi.prototype.showColumnMenuAfterMouseClick = function (colKey, mouseEvent) {
        var column = this.columnController.getPrimaryColumn(colKey);
        this.menuFactory.showMenuAfterMouseEvent(column, mouseEvent);
    };
    GridApi.prototype.tabToNextCell = function () {
        return this.rowRenderer.tabToNextCell(false);
    };
    GridApi.prototype.tabToPreviousCell = function () {
        return this.rowRenderer.tabToNextCell(true);
    };
    GridApi.prototype.stopEditing = function (cancel) {
        if (cancel === void 0) { cancel = false; }
        this.rowRenderer.stopEditing(cancel);
    };
    GridApi.prototype.startEditingCell = function (params) {
        var column = this.columnController.getGridColumn(params.colKey);
        var gridCellDef = { rowIndex: params.rowIndex, floating: null, column: column };
        var gridCell = new gridCell_1.GridCell(gridCellDef);
        this.rowRenderer.startEditingCell(gridCell, params.keyPress, params.charPress);
    };
    GridApi.prototype.addAggFunc = function (key, aggFunc) {
        if (this.aggFuncService) {
            this.aggFuncService.addAggFunc(key, aggFunc);
        }
    };
    GridApi.prototype.addAggFuncs = function (aggFuncs) {
        if (this.aggFuncService) {
            this.aggFuncService.addAggFuncs(aggFuncs);
        }
    };
    GridApi.prototype.clearAggFuncs = function () {
        if (this.aggFuncService) {
            this.aggFuncService.clear();
        }
    };
    GridApi.prototype.checkGridSize = function () {
        this.gridPanel.setBodyAndHeaderHeights();
    };
    return GridApi;
}());
__decorate([
    context_1.Autowired('csvCreator'),
    __metadata("design:type", csvCreator_1.CsvCreator)
], GridApi.prototype, "csvCreator", void 0);
__decorate([
    context_1.Autowired('gridCore'),
    __metadata("design:type", gridCore_1.GridCore)
], GridApi.prototype, "gridCore", void 0);
__decorate([
    context_1.Autowired('rowRenderer'),
    __metadata("design:type", rowRenderer_1.RowRenderer)
], GridApi.prototype, "rowRenderer", void 0);
__decorate([
    context_1.Autowired('headerRenderer'),
    __metadata("design:type", headerRenderer_1.HeaderRenderer)
], GridApi.prototype, "headerRenderer", void 0);
__decorate([
    context_1.Autowired('filterManager'),
    __metadata("design:type", filterManager_1.FilterManager)
], GridApi.prototype, "filterManager", void 0);
__decorate([
    context_1.Autowired('columnController'),
    __metadata("design:type", columnController_1.ColumnController)
], GridApi.prototype, "columnController", void 0);
__decorate([
    context_1.Autowired('selectionController'),
    __metadata("design:type", selectionController_1.SelectionController)
], GridApi.prototype, "selectionController", void 0);
__decorate([
    context_1.Autowired('gridOptionsWrapper'),
    __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)
], GridApi.prototype, "gridOptionsWrapper", void 0);
__decorate([
    context_1.Autowired('gridPanel'),
    __metadata("design:type", gridPanel_1.GridPanel)
], GridApi.prototype, "gridPanel", void 0);
__decorate([
    context_1.Autowired('valueService'),
    __metadata("design:type", valueService_1.ValueService)
], GridApi.prototype, "valueService", void 0);
__decorate([
    context_1.Autowired('masterSlaveService'),
    __metadata("design:type", masterSlaveService_1.MasterSlaveService)
], GridApi.prototype, "masterSlaveService", void 0);
__decorate([
    context_1.Autowired('eventService'),
    __metadata("design:type", eventService_1.EventService)
], GridApi.prototype, "eventService", void 0);
__decorate([
    context_1.Autowired('floatingRowModel'),
    __metadata("design:type", floatingRowModel_1.FloatingRowModel)
], GridApi.prototype, "floatingRowModel", void 0);
__decorate([
    context_1.Autowired('context'),
    __metadata("design:type", context_1.Context)
], GridApi.prototype, "context", void 0);
__decorate([
    context_1.Autowired('rowModel'),
    __metadata("design:type", Object)
], GridApi.prototype, "rowModel", void 0);
__decorate([
    context_1.Autowired('sortController'),
    __metadata("design:type", sortController_1.SortController)
], GridApi.prototype, "sortController", void 0);
__decorate([
    context_1.Autowired('focusedCellController'),
    __metadata("design:type", focusedCellController_1.FocusedCellController)
], GridApi.prototype, "focusedCellController", void 0);
__decorate([
    context_1.Optional('clipboardService'),
    __metadata("design:type", Object)
], GridApi.prototype, "clipboardService", void 0);
__decorate([
    context_1.Optional('aggFuncService'),
    __metadata("design:type", Object)
], GridApi.prototype, "aggFuncService", void 0);
__decorate([
    context_1.Autowired('menuFactory'),
    __metadata("design:type", Object)
], GridApi.prototype, "menuFactory", void 0);
__decorate([
    context_1.Autowired('cellRendererFactory'),
    __metadata("design:type", cellRendererFactory_1.CellRendererFactory)
], GridApi.prototype, "cellRendererFactory", void 0);
__decorate([
    context_1.Autowired('cellEditorFactory'),
    __metadata("design:type", cellEditorFactory_1.CellEditorFactory)
], GridApi.prototype, "cellEditorFactory", void 0);
__decorate([
    context_1.PostConstruct,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GridApi.prototype, "init", null);
GridApi = __decorate([
    context_1.Bean('gridApi')
], GridApi);
exports.GridApi = GridApi;
