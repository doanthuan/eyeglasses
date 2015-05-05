/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('ProductListController', ['$scope', 'Restangular',
    function($scope, Restangular) {

    $scope.isLoading = true;
    Restangular.all('product').getList().then(function(items) {

        $scope.items = items;

        $scope.total = items.total;

        $scope.isLoading = false;
    });

}]);