/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryListController', ['$scope', 'Restangular', 'toaster', '$location',
    function($scope, Restangular, toaster, $location) {

    $scope.add = function(){
        $location.path('/admin/category/add/');
    };

    $scope.remove = function(){
        //emit delete event to grid
        $scope.$emit('delete_item');
    };

    $scope.gridCols = [
        {title: 'Name', name: 'name', search: 'text'},
        {title: 'Child Count', name: 'child_count', search: 'text'}
    ];

    $scope.categories = null;


}]);