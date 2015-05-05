/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.product', []);

angular.module('myApp.product').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    // Now set up the states
    $stateProvider
        .state('admin.product', {
            url: "/product",
            controller: 'AdminProductListController',
            templateUrl: 'templates/admin/products/list.html'
        })
        .state('admin.product-add', {
            url: "/product/add/{id}",
            controller: 'AdminProductAddController',
            templateUrl: 'templates/admin/products/add.html'
        })
        .state('front.product', {
            url: "/products",
            controller: 'ProductListController',
            templateUrl: 'templates/products/list.html'
        })
    ;


}]);
