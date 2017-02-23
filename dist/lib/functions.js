/**
 * ag-grid-rx - Advanced Data Grid / Data Table with Observble rowData support (fork of ag-grid)
 * @version v8.1.0
 * @link https://github.com/mrsheepuk/ag-grid-rx
 * @license MIT
 */
"use strict";
var utils_1 = require("./utils");
function defaultGroupComparator(valueA, valueB, nodeA, nodeB) {
    var nodeAIsGroup = utils_1.Utils.exists(nodeA) && nodeA.group;
    var nodeBIsGroup = utils_1.Utils.exists(nodeB) && nodeB.group;
    var bothAreGroups = nodeAIsGroup && nodeBIsGroup;
    var bothAreNormal = !nodeAIsGroup && !nodeBIsGroup;
    if (bothAreGroups) {
        return utils_1.Utils.defaultComparator(nodeA.key, nodeB.key);
    }
    else if (bothAreNormal) {
        return utils_1.Utils.defaultComparator(valueA, valueB);
    }
    else if (nodeAIsGroup) {
        return 1;
    }
    else {
        return -1;
    }
}
exports.defaultGroupComparator = defaultGroupComparator;
