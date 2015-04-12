/**
 * Created by doanthuan on 4/9/2015.
 */

myAppProduct.controller('AdminProductListController', ['$scope', 'Product' , 'PaginationService', '$http', function($scope, Product, PaginationService, $http) {

    $scope.getPage = function(tableState) {

        $scope.isLoading = true;

        PaginationService.getPage('/product', tableState, function(result){

            $scope.products = result.data;

            $scope.total = result.total;

            $scope.isLoading = false;
        });

    };


}]);