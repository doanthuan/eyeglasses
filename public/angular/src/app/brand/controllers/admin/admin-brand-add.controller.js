/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.brand').controller('AdminBrandAddController',
    ['$scope','$location', 'toaster', 'Restangular', '$stateParams',
        function($scope, $location, toaster, Restangular, $stateParams) {

            $scope.cancel = function(){
                $location.path('/admin/brand');
            };

            $scope.save = function(){
                $scope.isSaving = true;
                Restangular.all('brand').post($scope.brand).then(
                    function(response){
                        toaster.pop('success', "", response.message);
                        $location.path('/admin/brand');
                        $scope.isSaving = false;
                    },
                    function(error){
                        toaster.pop('error', "", error.data.message);
                        $scope.isSaving = false;
                    }
                );
            };

            if($stateParams.id){
                $scope.isEdit = true;
                Restangular.one('brand', $stateParams.id).get().then(function(response){
                    $scope.brand = response;
                });

            }else{
                $scope.isEdit = false;
                $scope.brand = {};
            }


        }]);