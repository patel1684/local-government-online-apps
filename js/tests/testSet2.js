/*global define,require,$ */
/*jslint browser:true */
define(['tests/tools', 'tests/data', 'application/main'], function (tools, data, main) {
    'use strict';

    //===== Test set 2 =====
    // 2. otherwise, if the URL contains webmap and app, we have the webmap and app is the name of
    //    the file-based template item containing the app's UI; this is the preview use of an AGOL
    //    application
    var url = "webmap=70430e570f0840b4a5eb8da09cfa82f1&app=apps2/Finder",
        appUI = data.appUI("apps2/Finder"),
        webmap = data.webmap("70430e570f0840b4a5eb8da09cfa82f1");


    // Test point 1: entrypoint into main (startup)
    $.aop.before({
        target: main,
        method: "startup"
    }, function beforeStartup(args) {
        // args is an array containing function's args [config]
        var config = args[0];

        tools.showStatus(1, config !== undefined, "startup config");
        tools.showStatus(1, config.app === "apps2/Finder", "startup app param");
        tools.showStatus(1, config.appid === undefined, "startup appid param");
        tools.showStatus(1, config.webmap === "70430e570f0840b4a5eb8da09cfa82f1", "startup webmap param");
        tools.showStatus(1, config.ex === undefined, "startup ex param");

        tools.showStatus(1, config.appResponse === undefined, "startup appResponse");
    });

    // Test point 2: ready to create map (_createWebMap)
    $.aop.before({
        target: main,
        method: "_createWebMap"
    }, function beforeCreateWebMap(args) {
        // args is an array containing function's args [itemInfo, uiSource]
        var itemInfo = args[0], uiSource = args[1];

        tools.showStatus(2, uiSource === appUI.id, "_createWebMap uiSource");
        tools.showStatus(2, itemInfo.item.id === webmap.webmapId, "_createWebMap webmap item id");
        tools.showStatus(2, itemInfo.itemData.operationalLayers.length === webmap.numOpLayers, "_createWebMap # op layers");
        tools.showStatus(2, itemInfo.itemData.operationalLayers[0].id === webmap.opLayer0Id, "_createWebMap op layer id");
        tools.showStatus(2, itemInfo.itemData.operationalLayers[0].itemId === webmap.opLayer0ItemId, "_createWebMap op layer item id");
        tools.showStatus(2, itemInfo.itemData.operationalLayers[0].title === webmap.opLayer0Title, "_createWebMap title");
        tools.showStatus(2, itemInfo.itemData.operationalLayers[0].url === webmap.opLayer0Url, "_createWebMap url");
    });

    // Test point 3: map loaded & UI definition ready (_buildUI)
    $.aop.before({
        target: main,
        method: "_buildUI"
    }, function beforeBuildUI(args) {
        // args is an array containing function's args [uiConfig]
        var uiConfig = args[0];

        tools.showStatus(3, uiConfig.length === appUI.numObjects, "_buildUI uiConfig count");
        tools.showStatus(3, uiConfig[0].classname === appUI.ui0, "_buildUI uiConfig first UI item");
    });

    // Test point x: don't expect an error
    tools.showStatus(4, true);
    $.aop.before({
        target: main,
        method: "reportError"
    }, function beforeReportError(args) {
        // args is an array containing function's args [error]
        tools.showStatus(4, false, "reportError: " + args[0].message);
    });

    // Doublecheck URL
    var testURLSplit = tools.separateTestUrlParams(document.location.search);
    tools.showStatus(5, testURLSplit.url === url, "URL");

});
