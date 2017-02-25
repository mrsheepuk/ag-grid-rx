/**
 * ag-grid-rx - Advanced Data Grid / Data Table with Observble rowData support (fork of ag-grid)
 * @version v8.1.1-3
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
var context_1 = require("../context/context");
var gridOptionsWrapper_1 = require("../gridOptionsWrapper");
var ValueFormatterService = (function () {
    function ValueFormatterService() {
    }
    ValueFormatterService.prototype.formatValue = function (column, rowNode, $scope, rowIndex, value) {
        var formatter;
        var colDef = column.getColDef();
        // if floating, give preference to the floating formatter
        if (rowNode.floating) {
            formatter = colDef.floatingCellFormatter ? colDef.floatingCellFormatter : colDef.cellFormatter;
        }
        else {
            formatter = colDef.cellFormatter;
        }
        var result = null;
        if (formatter) {
            var params = {
                value: value,
                node: rowNode,
                column: column,
                $scope: $scope,
                rowIndex: rowIndex,
                api: this.gridOptionsWrapper.getApi(),
                context: this.gridOptionsWrapper.getContext()
            };
            result = formatter(params);
        }
        return result;
    };
    return ValueFormatterService;
}());
__decorate([
    context_1.Autowired('gridOptionsWrapper'),
    __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)
], ValueFormatterService.prototype, "gridOptionsWrapper", void 0);
ValueFormatterService = __decorate([
    context_1.Bean('valueFormatterService')
], ValueFormatterService);
exports.ValueFormatterService = ValueFormatterService;
