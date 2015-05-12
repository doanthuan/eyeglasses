/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('AdminProductListController', ['$scope', 'Restangular', 'toaster', '$location',
    function($scope, Restangular, toaster, $location) {

    $scope.add = function(){
        $location.path('/admin/product/add/');
    };

    $scope.remove = function(){
        //emit delete event to grid
        $scope.$emit('delete_item');
    };

    $scope.gridCols = [
        {title: 'Name', name: 'name', search: 'text'},
        {title: 'Price', name: 'price', search: 'text', format: 'currency'},
        {title: 'Created At', name: 'created_at', format: 'date'},
        {title: 'Status', name: 'status', format: 'status'}
        ];

    $scope.products = null;

}]);