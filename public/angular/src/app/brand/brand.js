/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.brand', []);

angular.module('myApp.brand').config(['$stateProvider', function($stateProvider) {

    $stateProvider
        .state('admin.brand', {
            url: "/brand",
            controller: 'AdminBrandListController',
            templateUrl: 'templates/admin/brands/list.html'
        })
        .state('admin.brand-add', {
            url: "/brand/add/{id}",
            templateUrl: 'templates/admin/brands/add.html',
            controller: 'AdminBrandAddController'
        })
    ;
}]);
