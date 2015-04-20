/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.category', []);

angular.module('myApp.category').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/admin/category', {
            controller: 'AdminCategoryListController',
            templateUrl: 'templates/admin/categories/list.html'
        })
        .when('/admin/category/add/:id?', {
            templateUrl: 'templates/admin/categories/add.html',
            controller: 'AdminCategoryAddController'
        })
}]);
