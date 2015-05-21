/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('ProductListController', ['$scope', 'Restangular', 'ProductService',
    function($scope, Restangular, ProductService) {

        $scope.sortBy = 'hits|DESC';
        $scope.filters = {};
        $scope.getList = function () {

            $scope.isLoading = true;

            var sortBy = $scope.sortBy;
            var sortSegments = sortBy.split('|');

            var params = {
                filters: $scope.filters,
                order: sortSegments[0],
                dir: sortSegments[1]
            };

            Restangular.all('product').getList(params).then(function(items) {

                angular.forEach(items, function(item){

                    ProductService.colorIdsToObjectsThumbnail(item);

                });

                $scope.items = items;

                $scope.total = items.total;

                $scope.isLoading = false;
            });
        };
        $scope.getList();

        $scope.getThumbnail = function(item){
            var result = '';
            angular.forEach(item.colors, function(color){
                if(color.active){
                    result = color.thumbnail;
                    return;
                }
            })
            return result;
        }

        $scope.selectColor = function(color, item){
            angular.forEach(item.colors, function(aColor){
                aColor.active = false;
            })
            color.active = true;
            item.thumbnail = color.thumbnail;
        }

        $scope.selectItem = function(item, filter){
            if(item.selected == null || item.selected == false){
                filter.push(item.id);
                item.selected = true;
            }
            else{
                filter.splice(filter.indexOf(item.id), 1);
                item.selected = false;
            }
            $scope.getList();
        }

        $scope.selectEligible = function(){
            $scope.filters.eligible = $scope.filters.eligible == ''? 1:'';
            $scope.getList();
        }

        $scope.clearAllFilters = function(){
            $scope.initFilters();
            $scope.getList();
        }

        $scope.initFilters = function(){
            $scope.filters.color = [];
            $scope.filters.face_shape = [];
            $scope.filters.frame_size = [];
            $scope.filters.frame_type = [];
            $scope.filters.frame_shape = [];
            $scope.filters.prices = [];
            $scope.filters.eligible = '';


            $scope.colors = ProductService.getColors();

            $scope.faceShapes = ProductService.getFaceShapes();

            $scope.frameSizes = ProductService.getFrameSizes();

            $scope.frameTypes = ProductService.getFrameTypes();

            $scope.frameShapes = ProductService.getFrameShapes();

            $scope.prices = ProductService.getFilterPrices();
        }
        $scope.initFilters();

        Restangular.all('brand').getList().then(function(items) {
            $scope.brands = items;
        });

    }]);