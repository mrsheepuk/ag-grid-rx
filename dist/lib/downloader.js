/**
 * ag-grid-rx - Advanced Data Grid / Data Table with Observble rowData support (fork of ag-grid)
 * @version v8.1.1-4
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
var context_1 = require("./context/context");
var Downloader = (function () {
    function Downloader() {
    }
    Downloader.prototype.download = function (fileName, content, mimeType) {
        // for Excel, we need \ufeff at the start
        // http://stackoverflow.com/questions/17879198/adding-utf-8-bom-to-string-blob
        var blobObject = new Blob(["\ufeff", content], {
            type: mimeType
        });
        // Internet Explorer
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blobObject, fileName);
        }
        else {
            // Chrome
            var downloadLink = document.createElement("a");
            downloadLink.href = window.URL.createObjectURL(blobObject);
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };
    return Downloader;
}());
Downloader = __decorate([
    context_1.Bean('downloader')
], Downloader);
exports.Downloader = Downloader;
