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

            $scope.isLoading = true;
            Restangular.all('category').getList().then(function(items) {

                $scope.categories = items;
                $scope.isLoading = false;
            });

            Restangular.all('brand').getList().then(function(items) {

                $scope.brands = items;
                $scope.isLoading = false;
            });

            $scope.colors = [
                {id: 1, name:'Black', class: 'black'},
                {id: 2, name:'Black 2', class: 'black2'},
                {id: 3, name:'Blue', class: 'blue'},
                {id: 4, name:'Brown', class: 'brown'},
                {id: 5, name:'Burgundy', class: 'burgundy'},
                {id: 6, name:'Crystal', class: 'crystal'},
                {id: 7, name:'Gold', class: 'gold'},
                {id: 8, name:'Green', class: 'green'},
                {id: 9, name:'Grey', class: 'grey'},
                {id: 10, name:'Gunmetal', class: 'gunmetal'},
                {id: 11, name:'Orange', class: 'orange'},
                {id: 12, name:'Pink', class: 'pink'},
                {id: 13, name:'Print', class: 'print'},
                {id: 14, name:'Purple', class: 'purple '},
                {id: 15, name:'Red', class: 'red'},
                {id: 16, name:'Silver', class: 'silver'},
                {id: 17, name:'Tortoise', class: 'tortoise'},
                {id: 18, name:'Turquoise', class: 'turquoise'},
                {id: 19, name:'White', class: 'white'},
                {id: 20, name:'Yellow', class: 'yellow'},
            ]

            if($stateParams.id){
                $scope.isEdit = true;
                Restangular.one('product', $stateParams.id).get().then(function(response){
                    $scope.product = response;
                });

            }else{
                $scope.isEdit = false;
                $scope.product = {};
            }


        }]);