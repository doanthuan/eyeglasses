/**
 * Created by doanthuan on 4/12/2015.
 */
angular.module('myApp.common').directive('appGrid', ['Restangular', 'toaster', '$location', '$state', '$sce',
    function (Restangular, toaster, $location, $state, $sce) {
    return {
        restrict: 'E',
        templateUrl: '/templates/common/directives/grid.html',
        scope: {
            url: '@',
            cols: '=',
            items: '=',
            itemKey: '@',
            action: '@?'
        },
        controller: function($scope, $element){
            $scope.getPage = function (tableState) {

                $scope.isLoading = true;

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

                Restangular.all($scope.url).getList(params).then(function(items) {

                    tableState.pagination.numberOfPages = items.last_page;//set the number of pages so the pagination can update

                    $scope.items = items;

                    $scope.total = items.total;

                    $scope.isLoading = false;
                });


            };

            $scope.checkAll = function(){
                angular.forEach($scope.items, function (item) {
                    item.selected = !$scope.selectedAll;
                });
            }

            $scope.editItem = function(item){
                var curUrl = $location.path();
                $location.path(curUrl + '/add/'+ item[$scope.itemKey]);
            }

            $scope.viewItem = function(item){
                var curUrl = $location.path();
                $location.path(curUrl + '/view/'+ item[$scope.itemKey]);
            }

            $scope.deleteItems = function(){

                $scope.isLoading = true;

                var deletedIds = [];
                var deletedItems = [];
                angular.forEach($scope.items, function (item) {
                    if(item.selected){
                        deletedIds.push(item[$scope.itemKey]);
                        deletedItems.push(item);
                    }
                });

                Restangular.all($scope.url + '/delete').post({'cid': deletedIds}).then(
                    function(response){
                        angular.forEach(deletedItems, function (item) {
                            var index = $scope.items.indexOf(item);
                            $scope.items.splice(index, 1);
                        });

                        if($scope.items.length == 0){
                            $state.reload();
                        }

                        $scope.isLoading = false;

                        toaster.pop('success', "", response.message);
                    },
                    function(response){
                        $scope.isLoading = false;

                        toaster.pop('error', "", response.data.message);
                    }
                );

            }

            $scope.$parent.$on('delete_item', function(e, data){
                $scope.deleteItems();
            });


            //action buttons
            if($scope.action == undefined){
                $scope.action = 'edit';
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
            else if(filterName == 'yes-no'){
                if(value == 1){
                    return 'Yes';
                } else{
                    return 'No';
                }
            }
            else if(filterName == 'order-status'){
                switch(value){
                    case 1:
                        return 'Created';
                    case 2:
                        return 'Paid';
                    case 3:
                        return 'Completed';
                    case -1:
                        return 'Error';
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