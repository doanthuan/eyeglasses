/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('AdminProductAddController',
    ['$scope','$location', 'toaster', 'Restangular', '$stateParams', 'Upload',
        function($scope, $location, toaster, Restangular, $stateParams, Upload) {

    $scope.cancel = function(){
        $location.path('/admin/product');
    }

    $scope.save = function(){
        $scope.isSaving = true;

        $scope.product.images = $scope.images;

        Restangular.all('product').post($scope.product).then(
            function(response){
                toaster.pop('success', "", response.message);
                $location.path('/admin/product');
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
        Restangular.one('product', $stateParams.id).get().then(function(response){
            $scope.product = response;
        });

    }else{
        $scope.isEdit = false;
        $scope.product = {};
    }


    $scope.tinymceOptions = {
        handle_event_callback: function (e) {
            // put logic here for keypress
        }
    };

    $scope.$watch('images', function () {
        $scope.upload($scope.images);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'media/upload',
                    fields: {'username': $scope.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    file.media_id = data;
                });
            }
        }
    };

}]);