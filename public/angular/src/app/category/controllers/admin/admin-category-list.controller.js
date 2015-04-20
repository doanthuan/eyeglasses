/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryListController', ['$scope', 'Category', 'Restangular',
    function($scope, Category, Restangular) {

    $scope.buttons = [
        'add', {
            name: 'delete',
            click: function(){
                $scope.deleteItems();
            }
        }
    ];

    $scope.gridCols = [
        {title: 'Name', name: 'name', search: 'text'},
        {title: 'Child Count', name: 'child_count', search: 'text'}
    ];

    $scope.categories = null;

    $scope.deleteItems = function(){
        angular.forEach($scope.categories, function (item) {
            console.log(item);
        });

    }


}]);