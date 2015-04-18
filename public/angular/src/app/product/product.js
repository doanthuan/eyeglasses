/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.product', []);

angular.module('myApp.product').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'ProductListController',
            templateUrl: 'templates/products/list.html'
        })
        .when('/admin/product', {
            controller: 'AdminProductListController',
            templateUrl: 'templates/admin/products/list.html'
        })
        .when('/admin/product/add', {
            controller: 'AdminProductAddController',
            templateUrl: 'templates/admin/products/add.html'
        })
}]);
