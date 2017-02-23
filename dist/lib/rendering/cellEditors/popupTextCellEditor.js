/**
 * ag-grid-rx - Advanced Data Grid / Data Table with Observble rowData support (fork of ag-grid)
 * @version v8.1.0
 * @link https://github.com/mrsheepuk/ag-grid-rx
 * @license MIT
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var textCellEditor_1 = require("./textCellEditor");
var PopupTextCellEditor = (function (_super) {
    __extends(PopupTextCellEditor, _super);
    function PopupTextCellEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PopupTextCellEditor.prototype.isPopup = function () {
        return true;
    };
    return PopupTextCellEditor;
}(textCellEditor_1.TextCellEditor));
exports.PopupTextCellEditor = PopupTextCellEditor;
