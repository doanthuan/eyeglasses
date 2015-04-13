/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.product', ['ngRoute', 'ngResource', 'myApp.common']);

angular.module('myApp.product').config(['$routeProvider', function($routeProvider) {
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
