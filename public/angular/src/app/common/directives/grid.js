/**
 * Created by doanthuan on 4/12/2015.
 */
angular.module('myApp.common').directive('appGrid', ['$http', 'Restangular', function ($http, Restangular) {
    return {
        restrict: 'E',
        templateUrl: '/templates/common/directives/grid.html',
        scope: {
            url: '@',
            cols: '=',
            items: '='
        },
        link: {
            pre: function (scope, element, attrs, ctrl) {

                scope.getPage = function (tableState) {

                    scope.isLoading = true;

                    var pagination = tableState.pagination;
                    if(pagination.number == undefined){
                        return false;
                    }

                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.
                    var page = start / pagination.number + 1;

                    var searchParams = tableState.search.predicateObject;
                    var orderBy = tableState.sort.predicate;
                    var orderDir = tableState.sort.reverse?1:0;

                    var params = {
                        limit: number,
                        page: page,
                        filters: searchParams,
                        order: orderBy,
                        dir: orderDir
                    };

                    Restangular.all(scope.url).getList(params).then(function(items) {

                        tableState.pagination.numberOfPages = items.last_page;//set the number of pages so the pagination can update

                        scope.items = items;

                        scope.total = items.total;

                        scope.isLoading = false;
                    });


                };

                scope.checkAll = function(){
                    angular.forEach(scope.items, function (item) {
                        item.Selected = !scope.selectedAll;
                    });
                }

            }
        }
    }
}]);

angular.module('myApp.common').filter('picker', function($filter) {
    return function(value, filterName) {
        if(filterName){
            if(filterName == 'status'){
                if(value == 1){
                    return 'Enabled';
                } else{
                    return 'Disabled';
                }
            }
            else{
                return $filter(filterName)(value);
            }
        }
        else{
            return value;
        }
    };
});