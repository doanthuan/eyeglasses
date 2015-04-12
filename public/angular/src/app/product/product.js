/**
 * Created by doanthuan on 4/9/2015.
 */
var myAppProduct = angular.module('myApp.product', ['ngRoute', 'ngResource', 'smart-table', 'myApp.common']);

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
