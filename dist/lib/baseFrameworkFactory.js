/**
 * ag-grid-rx - Advanced Data Grid / Data Table with Observble rowData support (fork of ag-grid)
 * @version v8.1.1
 * @link https://github.com/mrsheepuk/ag-grid-rx
 * @license MIT
 */
"use strict";
/** The base frameworks, eg React & Angular 2, override this bean with implementations specific to their requirement. */
var BaseFrameworkFactory = (function () {
    function BaseFrameworkFactory() {
    }
    BaseFrameworkFactory.prototype.dateComponent = function (gridOptions) {
        return gridOptions.dateComponent;
    };
    BaseFrameworkFactory.prototype.colDefFloatingCellRenderer = function (colDef) {
        return colDef.floatingCellRenderer;
    };
    BaseFrameworkFactory.prototype.colDefCellRenderer = function (colDef) {
        return colDef.cellRenderer;
    };
    BaseFrameworkFactory.prototype.colDefCellEditor = function (colDef) {
        return colDef.cellEditor;
    };
    BaseFrameworkFactory.prototype.colDefFilter = function (colDef) {
        return colDef.filter;
    };
    BaseFrameworkFactory.prototype.gridOptionsFullWidthCellRenderer = function (gridOptions) {
        return gridOptions.fullWidthCellRenderer;
    };
    BaseFrameworkFactory.prototype.gridOptionsGroupRowRenderer = function (gridOptions) {
        return gridOptions.groupRowRenderer;
    };
    BaseFrameworkFactory.prototype.gridOptionsGroupRowInnerRenderer = function (gridOptions) {
        return gridOptions.groupRowInnerRenderer;
    };
    BaseFrameworkFactory.prototype.setTimeout = function (action, timeout) {
        setTimeout(action, timeout);
    };
    return BaseFrameworkFactory;
}());
exports.BaseFrameworkFactory = BaseFrameworkFactory;
