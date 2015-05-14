/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('AdminProductAddController',
    ['$scope','$location', 'toaster', 'Restangular', '$stateParams', 'Upload', 'ProductService',
        function($scope, $location, toaster, Restangular, $stateParams, Upload, ProductService) {

            $scope.cancel = function(){
                $location.path('/admin/product');
            }

            $scope.save = function(){
                $scope.isSaving = true;

                var productImages = [];
                angular.forEach($scope.product.colors, function(color){
                    angular.forEach($scope.images[color.id], function(image){
                        productImages.push(image);
                    });
                });
                $scope.product.images = productImages;

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

            $scope.tinymceOptions = {
                handle_event_callback: function (e) {
                    // put logic here for keypress
                }
            };

            $scope.images = {};
            $scope.selectColors = function(){
                $scope.isSelected = true;
                angular.forEach($scope.product.colors, function(color){
                    var colorId = color.id;
                    if(typeof colorId != 'undefined'){
                        $scope.$watch('images.'+colorId, function (newvalue, oldvalue) {
                            if(newvalue == undefined || newvalue == null){
                                return;
                            }
                            $scope.upload($scope.images[colorId], colorId);
                        });
                    }
                })
            }

            $scope.upload = function (files, colorId) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        Upload.upload({
                            url: 'media/upload',
                            fields: {'color-id': colorId},
                            file: file
                        }).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                            $scope.isUploading = true;
                        }).success(function (data, status, headers, config) {
                            config.file.media_id = data;
                            files.push(config.file);
                            $scope.isUploading = false;
                        });
                    }
                    files = [];
                }
            };

            //init data
            $scope.genders = [
                {id: 1, name: 'Women'},
                {id: 2, name: 'Men'},
                {id: 3, name: 'Unisex'}
            ];

            $scope.colors = ProductService.getColors();

            $scope.shapes = ProductService.getFaceShapes();

            $scope.frameSizes = ProductService.getFrameSizes();

            $scope.frameTypes = ProductService.getFrameTypes();

            $scope.frameShapes = ProductService.getFrameShapes();


            $scope.isLoading = true;
            Restangular.all('category').getList().then(function(items) {

                $scope.categories = items;
                $scope.isLoading = false;

            });

            Restangular.all('brand').getList().then(function(items) {

                $scope.brands = items;
                $scope.isLoading = false;
            });

            $scope.product = {};
            if($stateParams.id){
                $scope.isEdit = true;
                Restangular.one('product', $stateParams.id).get().then(function(response){
                    $scope.product = response;
                });

            }else{
                $scope.isEdit = false;
            }


        }]);