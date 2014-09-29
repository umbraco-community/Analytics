﻿angular.module("umbraco").controller("Analytics.DashboardController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        // items list array
        $scope.items = [];
        $scope.itemsSources = [];
        $scope.itemsKeywords = [];

        // change sort icons
        function iconSorting(tableId, field) {
            $('#' + tableId + ' th i').each(function () {
                $(this).removeClass().addClass('icon'); // reset sort icon for columns with existing icons
            });
            if ($scope.descending)
                $('#' + tableId + ' #' + field + ' i').removeClass().addClass('icon-navigation-down');
            else
                $('#' + tableId + ' #' + field + ' i').removeClass().addClass('icon-navigation-up');
        }

        function fitToContainer(canvas) {
            canvas.style.width = '95%'; //'100%'
            //canvas.style.height = '100%';
            canvas.width = canvas.offsetWidth;
            //canvas.height = canvas.offsetHeight;
        }

        $scope.dateFilter = {};
        $scope.dateFilter.startDate = moment().subtract('days', 6).format('YYYY-MM-DD');
        $scope.dateFilter.endDate = moment().format('YYYY-MM-DD');
        
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            if (profileID == null || profileID == "") {
                $location.path("/analytics/analyticsTree/edit/settings");
                return;
            }
            
            //Get chart data for monthly visit chart
            statsResource.getvisitcharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                var chartData = response.data;

                //Create Line Chart
                var canvas = document.getElementById("viewMonths"),
                    ctx = canvas.getContext('2d');
                //var ctx = document.getElementById("viewMonths").getContext("2d");
                canvas.height = 300;
                fitToContainer(canvas);

                var viewMonthsChart = new Chart(ctx).Line(chartData);
            });

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getvisits(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                $scope.views = response.data;
                $scope.loadingViews = false;

                // clear existing items
                $scope.items.length = 0;
                // push objects to items array
                angular.forEach($scope.views.Rows, function (item) {
                    $scope.items.push({
                        pagepath: item.Cells[0],
                        visits: parseInt(item.Cells[1]),
                        pageviews: parseInt(item.Cells[2])
                    });
                });

                $scope.sort = function (newSortField) {
                    if ($scope.sortField == newSortField)
                        $scope.descending = !$scope.descending;

                    // sort by new field and change sort icons
                    $scope.sortField = newSortField;
                    iconSorting("tbl-views", newSortField);
                };

                var defaultSort = "pageviews"; // default sorting
                $scope.sortField = defaultSort;
                $scope.descending = true; // most pageviews first

                // change sort icons
                iconSorting("tbl-views", defaultSort);
            });

            //Get Browser specific via statsResource - does WebAPI GET call
            statsResource.getsources(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                $scope.sources = response.data;

                // clear existing items
                $scope.itemsSources.length = 0;
                // push objects to items array
                angular.forEach($scope.sources.Rows, function (item) {
                    $scope.itemsSources.push({
                        s_source: item.Cells[0],
                        s_visits: parseInt(item.Cells[1]),
                        s_pageviews: parseInt(item.Cells[2])
                    });
                });

                $scope.sort = function (newSortField) {
                    if ($scope.sortField == newSortField)
                        $scope.descending = !$scope.descending;

                    // sort by new field and change sort icons
                    $scope.sortField = newSortField;
                    iconSorting("tbl-sources", newSortField);
                };

                var defaultSort = "s_pageviews"; // default sorting
                $scope.sortField = defaultSort;
                $scope.descending = true; // most pageviews first

                // change sort icons
                iconSorting("tbl-sources", defaultSort);
            });
            
            //Keywords
            statsResource.getkeywords(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                $scope.keywords = response.data.ApiResult;

                // clear existing items
                $scope.itemsKeywords.length = 0;
                // push objects to items array
                angular.forEach($scope.keywords.Rows, function (item) {
                    $scope.itemsKeywords.push({
                        k_keyword: item.Cells[0],
                        k_visits: parseInt(item.Cells[1]),
                        k_pageviews: parseInt(item.Cells[2])
                    });
                });

                $scope.sort = function (newSortField) {
                    if ($scope.sortField == newSortField)
                        $scope.descending = !$scope.descending;

                    // sort by new field and change sort icons
                    $scope.sortField = newSortField;
                    iconSorting("tbl-keywords", newSortField);
                };

                var defaultSort = "k_pageviews"; // default sorting
                $scope.sortField = defaultSort;
                $scope.descending = true; // most pageviews first

                // change sort icons
                iconSorting("tbl-keywords", defaultSort);
            });
        });
});