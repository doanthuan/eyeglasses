/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryAddController',
    ['$scope','$location', 'toaster', 'Restangular', '$stateParams',
    function($scope, $location, toaster, Restangular, $stateParams) {

    $scope.cancel = function(){
        $location.path('/admin/category');
    }

    $scope.save = function(){
        $scope.isSaving = true;
        Restangular.all('category').post($scope.category).then(
            function(response){
                toaster.pop('success', "", response.message);
                $location.path('/admin/category');
                $scope.isSaving = false;
            },
            function(error){
                toaster.pop('error', "", error.data.message);
                $scope.isSaving = false;
            }
        );
    }

    if($stateParams.id){
        $scope.isEdit = true;
        Restangular.one('category', $stateParams.id).get().then(function(response){
            $scope.category = response;
        });

    }else{
        $scope.isEdit = false;
        $scope.category = {};
    }

}
]);