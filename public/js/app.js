var app = angular.module('app', ['ngRoute', 'ngResource',  'myApp.product']);

/**
 * Created by doanthuan on 4/9/2015.
 */
var myAppProduct = angular.module('myApp.product', ['ngRoute', 'ngResource']);

myAppProduct.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'ProductListController',
            templateUrl: 'views/products/list.html'
        })
        .when('/admin', {
            controller: 'AdminProductListController',
            templateUrl: 'views/admin/products/list.html'
        })
}]);

/**
 * Created by doanthuan on 4/9/2015.
 */

myAppProduct.controller('ProductListController', ['$scope', 'Product', '$http', function($scope, Product, $http) {
    Product.query( {} ,function(products) {
        console.log(products);
        $scope.products = products;
    }, function(error) {
        console.log(error);
    });

}]);
/**
 * Created by doanthuan on 4/9/2015.
 */

myAppProduct.factory('Product', ['$resource',
        function($resource) {
            return $resource('/product/:id', {id: '@id'},{
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }]
);

/**
 * Created by doanthuan on 4/9/2015.
 */

myAppProduct.controller('AdminProductListController', ['$scope', 'Product', '$http', function($scope, Product, $http) {
    Product.query( {} ,function(products) {
        console.log(products);
        $scope.products = products;
    }, function(error) {
        console.log(error);
    });

}]);
//# sourceMappingURL=app.js.map