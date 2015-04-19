/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryListController', ['$scope', function($scope) {

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

    $scope.deleteItems = function(){
        //angular.forEach($scope.items, function (item) {
        //    item.Selected = !scope.selectedAll;
        //});
        console.log($scope.items);
    }

}]);