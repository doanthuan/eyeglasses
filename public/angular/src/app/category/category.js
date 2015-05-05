/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.category', []);

angular.module('myApp.category').config(['$stateProvider', function($stateProvider) {

    $stateProvider
        .state('admin.category', {
            url: "/category",
            controller: 'AdminCategoryListController',
            templateUrl: 'templates/admin/categories/list.html'
        })
        .state('admin.category-add', {
            url: "/category/add/{id}",
            templateUrl: 'templates/admin/categories/add.html',
            controller: 'AdminCategoryAddController'
        })
    ;
}]);
