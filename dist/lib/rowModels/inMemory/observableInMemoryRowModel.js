/**
 * ag-grid-rx - Advanced Data Grid / Data Table with Observble rowData support (fork of ag-grid)
 * @version v8.1.1
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
var utils_1 = require("../../utils");
var constants_1 = require("../../constants");
var gridOptionsWrapper_1 = require("../../gridOptionsWrapper");
var columnController_1 = require("../../columnController/columnController");
var filterManager_1 = require("../../filter/filterManager");
var rowNode_1 = require("../../entities/rowNode");
var eventService_1 = require("../../eventService");
var events_1 = require("../../events");
var context_1 = require("../../context/context");
var selectionController_1 = require("../../selectionController");
var observableInMemoryNodeManager_1 = require("./observableInMemoryNodeManager");
var RecursionType;
(function (RecursionType) {
    RecursionType[RecursionType["Normal"] = 0] = "Normal";
    RecursionType[RecursionType["AfterFilter"] = 1] = "AfterFilter";
    RecursionType[RecursionType["AfterFilterAndSort"] = 2] = "AfterFilterAndSort";
    RecursionType[RecursionType["PivotNodes"] = 3] = "PivotNodes";
})(RecursionType || (RecursionType = {}));
;
var ObservableInMemoryRowModel = (function () {
    function ObservableInMemoryRowModel() {
        this.rowDataSubscription = null;
    }
    ObservableInMemoryRowModel.prototype.init = function () {
        this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.refreshModel.bind(this, { step: constants_1.Constants.STEP_EVERYTHING }));
        this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGED, this.refreshModel.bind(this, { step: constants_1.Constants.STEP_EVERYTHING }));
        this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_COLUMN_VALUE_CHANGED, this.onValueChanged.bind(this));
        this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_COLUMN_PIVOT_CHANGED, this.refreshModel.bind(this, { step: constants_1.Constants.STEP_PIVOT }));
        this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_FILTER_CHANGED, this.onFilterChanged.bind(this));
        this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_SORT_CHANGED, this.onSortChanged.bind(this));
        this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_COLUMN_PIVOT_MODE_CHANGED, this.refreshModel.bind(this, { step: constants_1.Constants.STEP_PIVOT }));
        this.rootNode = new rowNode_1.RowNode();
        this.nodeManager = new observableInMemoryNodeManager_1.ObservableInMemoryNodeManager(this.rootNode, this.gridOptionsWrapper, this.context, this.eventService);
        this.context.wireBean(this.rootNode);
        if (this.gridOptionsWrapper.isRowModelObservable()) {
            this.setRowDataSource(this.gridOptionsWrapper.getRowDataSource());
        }
    };
    ObservableInMemoryRowModel.prototype.destroy = function () {
        // Unsubscribe from any passed-in observable before destruction.
        if (this.rowDataSubscription)
            this.rowDataSubscription.unsubscribe();
    };
    ObservableInMemoryRowModel.prototype.onFilterChanged = function () {
        var animate = this.gridOptionsWrapper.isAnimateRows();
        this.refreshModel({ step: constants_1.Constants.STEP_FILTER, keepRenderedRows: true, animate: animate });
    };
    ObservableInMemoryRowModel.prototype.onSortChanged = function () {
        // we only act on the sort event here if the user is doing in grid sorting.
        // we ignore it if the sorting is happening on the server side.
        if (this.gridOptionsWrapper.isEnableServerSideSorting()) {
            return;
        }
        var animate = this.gridOptionsWrapper.isAnimateRows();
        this.refreshModel({ step: constants_1.Constants.STEP_SORT, keepRenderedRows: true, animate: animate, keepEditingRows: true });
    };
    ObservableInMemoryRowModel.prototype.getType = function () {
        return constants_1.Constants.ROW_MODEL_TYPE_NORMAL;
    };
    ObservableInMemoryRowModel.prototype.onValueChanged = function () {
        if (this.columnController.isPivotActive()) {
            this.refreshModel({ step: constants_1.Constants.STEP_PIVOT });
        }
        else {
            this.refreshModel({ step: constants_1.Constants.STEP_AGGREGATE });
        }
    };
    ObservableInMemoryRowModel.prototype.refreshModel = function (params) {
        // this goes through the pipeline of stages. what's in my head is similar
        // to the diagram on this page:
        // http://commons.apache.org/sandbox/commons-pipeline/pipeline_basics.html
        // however we want to keep the results of each stage, hence we manually call
        // each step rather than have them chain each other.
        var _this = this;
        // fallthrough in below switch is on purpose,
        // eg if STEP_FILTER, then all steps below this
        // step get done
        // var start: number;
        switch (params.step) {
            case constants_1.Constants.STEP_EVERYTHING:
                this.rootNode.childrenAfterGroup = this.rootNode.allLeafChildren;
            case constants_1.Constants.STEP_FILTER:
                this.doFilter();
            case constants_1.Constants.STEP_SORT:
                this.doSort();
            case constants_1.Constants.STEP_MAP:
                this.doRowsToDisplay();
        }
        var event = { animate: params.animate, keepRenderedRows: params.keepRenderedRows };
        this.eventService.dispatchEvent(events_1.Events.EVENT_MODEL_UPDATED, event);
        if (this.$scope) {
            setTimeout(function () {
                _this.$scope.$apply();
            }, 0);
        }
    };
    ObservableInMemoryRowModel.prototype.isEmpty = function () {
        var rowsMissing;
        rowsMissing = utils_1.Utils.missing(this.rootNode.allLeafChildren) || this.rootNode.allLeafChildren.length === 0;
        var empty = utils_1.Utils.missing(this.rootNode) || rowsMissing || !this.columnController.isReady();
        return empty;
    };
    ObservableInMemoryRowModel.prototype.isRowsToRender = function () {
        return utils_1.Utils.exists(this.rowsToDisplay) && this.rowsToDisplay.length > 0;
    };
    ObservableInMemoryRowModel.prototype.setDatasource = function (datasource) {
        console.error('ag-Grid-rx: should never call setDatasource on observableInMemoryRowController');
    };
    ObservableInMemoryRowModel.prototype.getTopLevelNodes = function () {
        return this.rootNode ? this.rootNode.childrenAfterGroup : null;
    };
    ObservableInMemoryRowModel.prototype.getRootNode = function () {
        return this.rootNode;
    };
    ObservableInMemoryRowModel.prototype.getRow = function (index) {
        return this.rowsToDisplay[index];
    };
    ObservableInMemoryRowModel.prototype.isRowPresent = function (rowNode) {
        return this.rowsToDisplay.indexOf(rowNode) >= 0;
    };
    ObservableInMemoryRowModel.prototype.getVirtualRowCount = function () {
        console.warn('ag-Grid: rowModel.getVirtualRowCount() is not longer a function, use rowModel.getRowCount() instead');
        return this.getRowCount();
    };
    ObservableInMemoryRowModel.prototype.getRowCount = function () {
        if (this.rowsToDisplay) {
            return this.rowsToDisplay.length;
        }
        else {
            return 0;
        }
    };
    ObservableInMemoryRowModel.prototype.getRowIndexAtPixel = function (pixelToMatch) {
        if (this.isEmpty()) {
            return -1;
        }
        // do binary search of tree
        // http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/
        var bottomPointer = 0;
        var topPointer = this.rowsToDisplay.length - 1;
        // quick check, if the pixel is out of bounds, then return last row
        if (pixelToMatch <= 0) {
            // if pixel is less than or equal zero, it's always the first row
            return 0;
        }
        var lastNode = this.rowsToDisplay[this.rowsToDisplay.length - 1];
        if (lastNode.rowTop <= pixelToMatch) {
            return this.rowsToDisplay.length - 1;
        }
        while (true) {
            var midPointer = Math.floor((bottomPointer + topPointer) / 2);
            var currentRowNode = this.rowsToDisplay[midPointer];
            if (this.isRowInPixel(currentRowNode, pixelToMatch)) {
                return midPointer;
            }
            else if (currentRowNode.rowTop < pixelToMatch) {
                bottomPointer = midPointer + 1;
            }
            else if (currentRowNode.rowTop > pixelToMatch) {
                topPointer = midPointer - 1;
            }
        }
    };
    ObservableInMemoryRowModel.prototype.isRowInPixel = function (rowNode, pixelToMatch) {
        var topPixel = rowNode.rowTop;
        var bottomPixel = rowNode.rowTop + rowNode.rowHeight;
        var pixelInRow = topPixel <= pixelToMatch && bottomPixel > pixelToMatch;
        return pixelInRow;
    };
    ObservableInMemoryRowModel.prototype.getRowCombinedHeight = function () {
        if (this.rowsToDisplay && this.rowsToDisplay.length > 0) {
            var lastRow = this.rowsToDisplay[this.rowsToDisplay.length - 1];
            var lastPixel = lastRow.rowTop + lastRow.rowHeight;
            return lastPixel;
        }
        else {
            return 0;
        }
    };
    ObservableInMemoryRowModel.prototype.forEachNode = function (callback) {
        if (this.rootNode.allLeafChildren) {
            this.rootNode.allLeafChildren.forEach(function (rowNode, index) { return callback(rowNode, index); });
        }
    };
    ObservableInMemoryRowModel.prototype.doSort = function () {
        this.sortStage.execute({ rowNode: this.rootNode });
    };
    ObservableInMemoryRowModel.prototype.doFilter = function () {
        this.filterStage.execute({ rowNode: this.rootNode });
    };
    ObservableInMemoryRowModel.prototype.setRowDataSource = function (rowData) {
        var _this = this;
        // If we're already subscribed to an observable, unsubscribe.
        if (this.rowDataSubscription)
            this.rowDataSubscription.unsubscribe();
        // Start with an empty data set for our new observable.
        this.updateRowData([]);
        // If we've been handed a null observable, nothing more to do. 
        if (!rowData)
            return;
        // Subcribe to our new rowData source.
        this.rowDataSubscription = rowData.subscribe(function (newData) {
            _this.updateRowData(newData);
        });
    };
    ObservableInMemoryRowModel.prototype.updateRowData = function (newData) {
        // When the data observable provides new data, handle it in a similar way to
        // how setRowData used to work, but use updateRowData on the nodeManager instead
        // of setRowData, and telling anything waiting for data updates that it's cool
        // to keep rendered rows, as we're trying to keep the same row nodes in place
        // wherever possible.
        this.nodeManager.updateRowData(newData);
        // Refresh the model, provided the column controller is ready.
        if (this.columnController.isReady()) {
            // Tell downstream that it is OK to keep rendered rows, as we've tried to maintain
            // the same set of nodes wherever possible.
            this.refreshModel({ step: constants_1.Constants.STEP_EVERYTHING, keepRenderedRows: true });
        }
        // - update selection
        // - update filters
        // - shows 'no rows' overlay if needed
        this.eventService.dispatchEvent(events_1.Events.EVENT_ROW_DATA_CHANGED);
    };
    ObservableInMemoryRowModel.prototype.doRowsToDisplay = function () {
        this.rowsToDisplay = this.flattenStage.execute({ rowNode: this.rootNode });
    };
    ObservableInMemoryRowModel.prototype.insertItemsAtIndex = function (index, items, skipRefresh) {
        console.error('ag-Grid-rx: insertItemsAtIndex not supported by observableInMemoryRowController');
    };
    ObservableInMemoryRowModel.prototype.onRowHeightChanged = function () {
        this.refreshModel({ step: constants_1.Constants.STEP_MAP, keepRenderedRows: true, keepEditingRows: true });
    };
    ObservableInMemoryRowModel.prototype.resetRowHeights = function () {
        this.forEachNode(function (rowNode) { return rowNode.setRowHeight(null); });
        this.onRowHeightChanged();
    };
    ObservableInMemoryRowModel.prototype.removeItems = function (rowNodes, skipRefresh) {
        console.error('ag-Grid-rx: removeItems not supported by observableInMemoryRowController');
    };
    ObservableInMemoryRowModel.prototype.addItems = function (items, skipRefresh) {
        console.error('ag-Grid-rx: addItems not supported by observableInMemoryRowController');
    };
    return ObservableInMemoryRowModel;
}());
__decorate([
    context_1.Autowired('gridOptionsWrapper'),
    __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)
], ObservableInMemoryRowModel.prototype, "gridOptionsWrapper", void 0);
__decorate([
    context_1.Autowired('columnController'),
    __metadata("design:type", columnController_1.ColumnController)
], ObservableInMemoryRowModel.prototype, "columnController", void 0);
__decorate([
    context_1.Autowired('filterManager'),
    __metadata("design:type", filterManager_1.FilterManager)
], ObservableInMemoryRowModel.prototype, "filterManager", void 0);
__decorate([
    context_1.Autowired('$scope'),
    __metadata("design:type", Object)
], ObservableInMemoryRowModel.prototype, "$scope", void 0);
__decorate([
    context_1.Autowired('selectionController'),
    __metadata("design:type", selectionController_1.SelectionController)
], ObservableInMemoryRowModel.prototype, "selectionController", void 0);
__decorate([
    context_1.Autowired('eventService'),
    __metadata("design:type", eventService_1.EventService)
], ObservableInMemoryRowModel.prototype, "eventService", void 0);
__decorate([
    context_1.Autowired('context'),
    __metadata("design:type", context_1.Context)
], ObservableInMemoryRowModel.prototype, "context", void 0);
__decorate([
    context_1.Autowired('filterStage'),
    __metadata("design:type", Object)
], ObservableInMemoryRowModel.prototype, "filterStage", void 0);
__decorate([
    context_1.Autowired('sortStage'),
    __metadata("design:type", Object)
], ObservableInMemoryRowModel.prototype, "sortStage", void 0);
__decorate([
    context_1.Autowired('flattenStage'),
    __metadata("design:type", Object)
], ObservableInMemoryRowModel.prototype, "flattenStage", void 0);
__decorate([
    context_1.PostConstruct,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ObservableInMemoryRowModel.prototype, "init", null);
__decorate([
    context_1.PreDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ObservableInMemoryRowModel.prototype, "destroy", null);
ObservableInMemoryRowModel = __decorate([
    context_1.Bean('rowModel')
], ObservableInMemoryRowModel);
exports.ObservableInMemoryRowModel = ObservableInMemoryRowModel;
