/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('ProductListController', ['$scope', 'Product', '$http', function($scope, Product, $http) {
    Product.query( {} ,function(products) {
        console.log(products);
        $scope.products = products;
    }, function(error) {
        console.log(error);
    });

}]);