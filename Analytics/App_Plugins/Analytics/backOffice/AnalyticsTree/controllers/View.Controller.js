﻿angular.module("umbraco").controller("Analytics.ViewController",
    function ($scope, $routeParams, analyticsSettingsResource, assetsService) {

        //Currently loading /umbraco/general.html
        //Need it to look at /App_Plugins/
        //$scope.dateFilter = analyticsSettingsResource.getDateFilter();
        //$scope.$watch('dateFilter', function () {
        //    console.log("parent watch");
        //});
        
        var viewName = $routeParams.id;
        viewName = viewName.replace('%20', '-').replace(' ', '-');

        $scope.templatePartialURL = '../App_Plugins/Analytics/backoffice/analyticsTree/partials/' + viewName + '.html';
        $scope.sectionName = $routeParams.id;
    });