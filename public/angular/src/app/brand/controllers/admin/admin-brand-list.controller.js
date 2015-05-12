/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.brand').controller('AdminBrandListController', ['$scope', 'Restangular', 'toaster', '$location',
    function($scope, Restangular, toaster, $location) {

    $scope.add = function(){
        $location.path('/admin/brand/add/');
    };

    $scope.remove = function(){
        //emit delete event to grid
        $scope.$emit('delete_item');
    };

    $scope.gridCols = [
        {title: 'Name', name: 'name', search: 'text'},
        {title: 'For Men', name: 'for_men', format: 'yes-no'},
        {title: 'For Women', name: 'for_women', format: 'yes-no'}
    ];

    $scope.brands = null;


}]);