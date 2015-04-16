/**
 * Created by doanthuan on 4/12/2015.
 */
angular.module('myApp.common').directive('appGrid', ['PaginationService', function (PaginationService) {
    return {
        restrict: 'E',
        templateUrl: '/templates/common/directives/grid.html',
        scope: {
            url: '@',
            cols: '='
        },
        link: {
            pre: function (scope, element, attrs, ctrl) {

                scope.getPage = function(tableState) {

                    scope.isLoading = true;

                    PaginationService.getPage(scope.url, tableState, function(result){

                        scope.items = result.data;

                        scope.total = result.total;

                        scope.isLoading = false;
                    });

                };
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