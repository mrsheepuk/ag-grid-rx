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
var inMemoryNodeManager_1 = require("./inMemoryNodeManager");
var RecursionType;
(function (RecursionType) {
    RecursionType[RecursionType["Normal"] = 0] = "Normal";
    RecursionType[RecursionType["AfterFilter"] = 1] = "AfterFilter";
    RecursionType[RecursionType["AfterFilterAndSort"] = 2] = "AfterFilterAndSort";
    RecursionType[RecursionType["PivotNodes"] = 3] = "PivotNodes";
})(RecursionType || (RecursionType = {}));
;
var InMemoryRowModel = (function () {
    function InMemoryRowModel() {
        // Current subscription to a supplied observable.
        this.rowDataSubscription = null;
    }
    InMemoryRowModel.prototype.init = function () {
        this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.refreshModel.bind(this, { step: constants_1.Constants.STEP_EVERYTHING }));
        this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_COLUMN_VALUE_CHANGED, this.onValueChanged.bind(this));
        this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_FILTER_CHANGED, this.onFilterChanged.bind(this));
        this.eventService.addModalPriorityEventListener(events_1.Events.EVENT_SORT_CHANGED, this.onSortChanged.bind(this));
        this.rootNode = new rowNode_1.RowNode();
        this.nodeManager = new inMemoryNodeManager_1.InMemoryNodeManager(this.rootNode, this.gridOptionsWrapper, this.context, this.eventService);
        this.context.wireBean(this.rootNode);
        if (this.gridOptionsWrapper.isRowModelDefault()) {
            this.setRowData(this.gridOptionsWrapper.getRowData());
        }
    };
    InMemoryRowModel.prototype.destroy = function () {
        // Unsubscribe from any passed-in observable before destruction.
        if (this.rowDataSubscription)
            this.rowDataSubscription.unsubscribe();
    };
    InMemoryRowModel.prototype.onFilterChanged = function () {
        var animate = this.gridOptionsWrapper.isAnimateRows();
        this.refreshModel({ step: constants_1.Constants.STEP_FILTER, keepRenderedRows: true, animate: animate });
    };
    InMemoryRowModel.prototype.onSortChanged = function () {
        // we only act on the sort event here if the user is doing in grid sorting.
        // we ignore it if the sorting is happening on the server side.
        if (this.gridOptionsWrapper.isEnableServerSideSorting()) {
            return;
        }
        var animate = this.gridOptionsWrapper.isAnimateRows();
        this.refreshModel({ step: constants_1.Constants.STEP_SORT, keepRenderedRows: true, animate: animate, keepEditingRows: true });
    };
    InMemoryRowModel.prototype.getType = function () {
        return constants_1.Constants.ROW_MODEL_TYPE_NORMAL;
    };
    InMemoryRowModel.prototype.onValueChanged = function () {
        this.refreshModel({ step: constants_1.Constants.STEP_AGGREGATE });
    };
    InMemoryRowModel.prototype.refreshModel = function (params) {
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
        // console.log('======= start =======');
        switch (params.step) {
            case constants_1.Constants.STEP_EVERYTHING:
                // start = new Date().getTime();
                this.doRowGrouping(params.groupState, params.newRowNodes);
            // console.log('rowGrouping = ' + (new Date().getTime() - start));
            case constants_1.Constants.STEP_FILTER:
                // start = new Date().getTime();
                this.doFilter();
            // console.log('filter = ' + (new Date().getTime() - start));
            case constants_1.Constants.STEP_AGGREGATE:
                // start = new Date().getTime();
                this.doAggregate();
            // console.log('aggregation = ' + (new Date().getTime() - start));
            case constants_1.Constants.STEP_SORT:
                // start = new Date().getTime();
                this.doSort();
            // console.log('sort = ' + (new Date().getTime() - start));
            case constants_1.Constants.STEP_MAP:
                // start = new Date().getTime();
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
    InMemoryRowModel.prototype.isEmpty = function () {
        var rowsMissing;
        rowsMissing = utils_1.Utils.missing(this.rootNode.allLeafChildren) || this.rootNode.allLeafChildren.length === 0;
        var empty = utils_1.Utils.missing(this.rootNode) || rowsMissing || !this.columnController.isReady();
        return empty;
    };
    InMemoryRowModel.prototype.isRowsToRender = function () {
        return utils_1.Utils.exists(this.rowsToDisplay) && this.rowsToDisplay.length > 0;
    };
    InMemoryRowModel.prototype.setDatasource = function (datasource) {
        console.error('ag-Grid: should never call setDatasource on inMemoryRowController');
    };
    InMemoryRowModel.prototype.getTopLevelNodes = function () {
        return this.rootNode ? this.rootNode.childrenAfterGroup : null;
    };
    InMemoryRowModel.prototype.getRootNode = function () {
        return this.rootNode;
    };
    InMemoryRowModel.prototype.getRow = function (index) {
        return this.rowsToDisplay[index];
    };
    InMemoryRowModel.prototype.isRowPresent = function (rowNode) {
        return this.rowsToDisplay.indexOf(rowNode) >= 0;
    };
    InMemoryRowModel.prototype.getVirtualRowCount = function () {
        console.warn('ag-Grid: rowModel.getVirtualRowCount() is not longer a function, use rowModel.getRowCount() instead');
        return this.getRowCount();
    };
    InMemoryRowModel.prototype.getRowCount = function () {
        if (this.rowsToDisplay) {
            return this.rowsToDisplay.length;
        }
        else {
            return 0;
        }
    };
    InMemoryRowModel.prototype.getRowIndexAtPixel = function (pixelToMatch) {
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
    InMemoryRowModel.prototype.isRowInPixel = function (rowNode, pixelToMatch) {
        var topPixel = rowNode.rowTop;
        var bottomPixel = rowNode.rowTop + rowNode.rowHeight;
        var pixelInRow = topPixel <= pixelToMatch && bottomPixel > pixelToMatch;
        return pixelInRow;
    };
    InMemoryRowModel.prototype.getRowCombinedHeight = function () {
        if (this.rowsToDisplay && this.rowsToDisplay.length > 0) {
            var lastRow = this.rowsToDisplay[this.rowsToDisplay.length - 1];
            var lastPixel = lastRow.rowTop + lastRow.rowHeight;
            return lastPixel;
        }
        else {
            return 0;
        }
    };
    InMemoryRowModel.prototype.forEachLeafNode = function (callback) {
        if (this.rootNode.allLeafChildren) {
            this.rootNode.allLeafChildren.forEach(function (rowNode, index) { return callback(rowNode, index); });
        }
    };
    InMemoryRowModel.prototype.forEachNode = function (callback) {
        this.recursivelyWalkNodesAndCallback(this.rootNode.childrenAfterGroup, callback, RecursionType.Normal, 0);
    };
    InMemoryRowModel.prototype.forEachNodeAfterFilter = function (callback) {
        this.recursivelyWalkNodesAndCallback(this.rootNode.childrenAfterFilter, callback, RecursionType.AfterFilter, 0);
    };
    InMemoryRowModel.prototype.forEachNodeAfterFilterAndSort = function (callback) {
        this.recursivelyWalkNodesAndCallback(this.rootNode.childrenAfterSort, callback, RecursionType.AfterFilterAndSort, 0);
    };
    InMemoryRowModel.prototype.forEachPivotNode = function (callback) {
        this.recursivelyWalkNodesAndCallback([this.rootNode], callback, RecursionType.PivotNodes, 0);
    };
    // iterates through each item in memory, and calls the callback function
    // nodes - the rowNodes to traverse
    // callback - the user provided callback
    // recursion type - need this to know what child nodes to recurse, eg if looking at all nodes, or filtered notes etc
    // index - works similar to the index in forEach in javascripts array function
    InMemoryRowModel.prototype.recursivelyWalkNodesAndCallback = function (nodes, callback, recursionType, index) {
        if (nodes) {
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                callback(node, index++);
                // go to the next level if it is a group
                if (node.group) {
                    // depending on the recursion type, we pick a difference set of children
                    var nodeChildren;
                    switch (recursionType) {
                        case RecursionType.Normal:
                            nodeChildren = node.childrenAfterGroup;
                            break;
                        case RecursionType.AfterFilter:
                            nodeChildren = node.childrenAfterFilter;
                            break;
                        case RecursionType.AfterFilterAndSort:
                            nodeChildren = node.childrenAfterSort;
                            break;
                        case RecursionType.PivotNodes:
                            // for pivot, we don't go below leafGroup levels
                            nodeChildren = !node.leafGroup ? node.childrenAfterSort : null;
                            break;
                    }
                    if (nodeChildren) {
                        index = this.recursivelyWalkNodesAndCallback(nodeChildren, callback, recursionType, index);
                    }
                }
            }
        }
        return index;
    };
    // it's possible to recompute the aggregate without doing the other parts
    // + gridApi.recomputeAggregates()
    InMemoryRowModel.prototype.doAggregate = function () {
        if (this.aggregationStage) {
            this.aggregationStage.execute({ rowNode: this.rootNode });
        }
    };
    InMemoryRowModel.prototype.doSort = function () {
        this.sortStage.execute({ rowNode: this.rootNode });
    };
    InMemoryRowModel.prototype.doRowGrouping = function (groupState, newRowNodes) {
        // No grouping support in ag-grid-rx
        this.rootNode.childrenAfterGroup = this.rootNode.allLeafChildren;
    };
    InMemoryRowModel.prototype.restoreGroupState = function (groupState) {
        if (!groupState) {
            return;
        }
        utils_1.Utils.traverseNodesWithKey(this.rootNode.childrenAfterGroup, function (node, key) {
            // if the group was open last time, then open it this time. however
            // if was not open last time, then don't touch the group, so the 'groupDefaultExpanded'
            // setting will take effect.
            if (typeof groupState[key] === 'boolean') {
                node.expanded = groupState[key];
            }
        });
    };
    InMemoryRowModel.prototype.doFilter = function () {
        this.filterStage.execute({ rowNode: this.rootNode });
    };
    InMemoryRowModel.prototype.doPivot = function () {
        if (this.pivotStage) {
            this.pivotStage.execute({ rowNode: this.rootNode });
        }
    };
    InMemoryRowModel.prototype.getGroupState = function () {
        if (!this.rootNode.childrenAfterGroup || !this.gridOptionsWrapper.isRememberGroupStateWhenNewData()) {
            return null;
        }
        var result = {};
        utils_1.Utils.traverseNodesWithKey(this.rootNode.childrenAfterGroup, function (node, key) { return result[key] = node.expanded; });
        return result;
    };
    InMemoryRowModel.prototype.setRowData = function (rowData) {
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
    InMemoryRowModel.prototype.updateRowData = function (newData) {
        // When the data observable provides new data, handle it in a similar way to
        // how setRowData used to work, but use updateRowData on the nodeManager instead
        // of setRowData, and telling anything waiting for data updates that it's cool
        // to keep rendered rows, as we're trying to keep the same row nodes in place
        // wherever possible.
        // remember group state, so we can expand groups that should be expanded
        var groupState = this.getGroupState();
        this.nodeManager.updateRowData(newData);
        // Refresh the model, provided the column controller is ready.
        if (this.columnController.isReady()) {
            // Tell downstream that it is OK to keep rendered rows, as we've tried to maintain
            // the same set of nodes wherever possible.
            this.refreshModel({ step: constants_1.Constants.STEP_EVERYTHING, groupState: groupState, keepRenderedRows: true });
        }
        // - update selection
        // - update filters
        // - shows 'no rows' overlay if needed
        this.eventService.dispatchEvent(events_1.Events.EVENT_ROW_DATA_CHANGED);
    };
    InMemoryRowModel.prototype.doRowsToDisplay = function () {
        this.rowsToDisplay = this.flattenStage.execute({ rowNode: this.rootNode });
    };
    InMemoryRowModel.prototype.onRowHeightChanged = function () {
        this.refreshModel({ step: constants_1.Constants.STEP_MAP, keepRenderedRows: true, keepEditingRows: true });
    };
    InMemoryRowModel.prototype.resetRowHeights = function () {
        this.forEachNode(function (rowNode) { return rowNode.setRowHeight(null); });
        this.onRowHeightChanged();
    };
    return InMemoryRowModel;
}());
__decorate([
    context_1.Autowired('gridOptionsWrapper'),
    __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)
], InMemoryRowModel.prototype, "gridOptionsWrapper", void 0);
__decorate([
    context_1.Autowired('columnController'),
    __metadata("design:type", columnController_1.ColumnController)
], InMemoryRowModel.prototype, "columnController", void 0);
__decorate([
    context_1.Autowired('filterManager'),
    __metadata("design:type", filterManager_1.FilterManager)
], InMemoryRowModel.prototype, "filterManager", void 0);
__decorate([
    context_1.Autowired('$scope'),
    __metadata("design:type", Object)
], InMemoryRowModel.prototype, "$scope", void 0);
__decorate([
    context_1.Autowired('selectionController'),
    __metadata("design:type", selectionController_1.SelectionController)
], InMemoryRowModel.prototype, "selectionController", void 0);
__decorate([
    context_1.Autowired('eventService'),
    __metadata("design:type", eventService_1.EventService)
], InMemoryRowModel.prototype, "eventService", void 0);
__decorate([
    context_1.Autowired('context'),
    __metadata("design:type", context_1.Context)
], InMemoryRowModel.prototype, "context", void 0);
__decorate([
    context_1.Autowired('filterStage'),
    __metadata("design:type", Object)
], InMemoryRowModel.prototype, "filterStage", void 0);
__decorate([
    context_1.Autowired('sortStage'),
    __metadata("design:type", Object)
], InMemoryRowModel.prototype, "sortStage", void 0);
__decorate([
    context_1.Autowired('flattenStage'),
    __metadata("design:type", Object)
], InMemoryRowModel.prototype, "flattenStage", void 0);
__decorate([
    context_1.Optional('groupStage'),
    __metadata("design:type", Object)
], InMemoryRowModel.prototype, "groupStage", void 0);
__decorate([
    context_1.Optional('aggregationStage'),
    __metadata("design:type", Object)
], InMemoryRowModel.prototype, "aggregationStage", void 0);
__decorate([
    context_1.Optional('pivotStage'),
    __metadata("design:type", Object)
], InMemoryRowModel.prototype, "pivotStage", void 0);
__decorate([
    context_1.PostConstruct,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InMemoryRowModel.prototype, "init", null);
__decorate([
    context_1.PreDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InMemoryRowModel.prototype, "destroy", null);
InMemoryRowModel = __decorate([
    context_1.Bean('rowModel')
], InMemoryRowModel);
exports.InMemoryRowModel = InMemoryRowModel;
