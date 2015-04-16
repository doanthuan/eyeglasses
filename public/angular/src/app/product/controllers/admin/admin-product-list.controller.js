/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('AdminProductListController', ['$scope', function($scope) {

    $scope.gridCols = [
        {title: 'Name', name: 'name', search: 'text'},
        {title: 'Price', name: 'price', search: 'text', format: 'currency'},
        {title: 'Quantity', name: 'quantity', search: 'text'},
        {title: 'Created At', name: 'created_at', format: 'date'},
        {title: 'Status', name: 'status', format: 'status'}
    ];

}]);