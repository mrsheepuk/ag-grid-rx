/**
 * ag-grid-rx - Advanced Data Grid / Data Table with Observble rowData support (fork of ag-grid)
 * @version v8.0.1
 * @link https://github.com/mrsheepuk/ag-grid-rx
 * @license MIT
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var selectCellEditor_1 = require("./selectCellEditor");
var PopupSelectCellEditor = (function (_super) {
    __extends(PopupSelectCellEditor, _super);
    function PopupSelectCellEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PopupSelectCellEditor.prototype.isPopup = function () {
        return true;
    };
    return PopupSelectCellEditor;
}(selectCellEditor_1.SelectCellEditor));
exports.PopupSelectCellEditor = PopupSelectCellEditor;
