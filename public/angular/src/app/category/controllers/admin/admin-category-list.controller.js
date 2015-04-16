/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryListController', ['$scope', function($scope) {

    $scope.gridCols = [
        {title: 'Name', name: 'name', search: 'text'},
        {title: 'Child Count', name: 'child_count', search: 'text'}
    ];

}]);