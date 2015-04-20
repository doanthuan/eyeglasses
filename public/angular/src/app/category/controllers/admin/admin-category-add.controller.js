/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryAddController', ['$scope','$location', 'toaster', 'Restangular', '$routeParams',
    function($scope, $location, toaster, Restangular, $routeParams) {

    $scope.cancel = function(){
        $location.path('/admin/category');
    }

    $scope.save = function(){
        Restangular.all('category').post($scope.category).then(function(response){
            toaster.pop('success', "", response.message);
            $location.path('/admin/category');
        });
    }

    if($routeParams.id){
        $scope.isEdit = true;
        Restangular.one('category', $routeParams.id).get().then(function(response){
            $scope.category = response;
        });

    }else{
        $scope.isEdit = false;
        $scope.category = {};
    }

}
]);