/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('ProductViewController', ['$scope', 'Restangular', 'ProductService', '$stateParams', '$timeout', '$location', 'CartService',
    function ($scope, Restangular, ProductService, $stateParams, $timeout, $location, CartService) {

        $scope.isLoading = true;
        Restangular.one('product/get-by-alias', $stateParams.alias).get().then(function (product) {

            ProductService.colorIdsToObjects(product);

            $scope.product = product;

            $scope.product.colors[0].selected = true;
            $scope.selectedColorName = $scope.product.colors[0].name;

            $scope.isLoading = false;

        });

        $scope.$on('ALWAYS', function() {
            $scope.initGallery();
        });

        $scope.initGallery = function(){
            angular.forEach($scope.product.colors, function(color){
                $("#zoom_"+color.id).elevateZoom({
                    gallery: 'gallery_'+color.id,
                    cursor: 'pointer',
                    galleryActiveClass: 'active',
                    imageCrossfade: true,
                    scrollZoom : true,
                    constrainType:"width",
                    constrainSize:643
                });
            })
        };

        $scope.selectColor = function(color){
            angular.forEach($scope.product.colors, function(color){
                color.selected = false;
            })

            $scope.selectedColorName = color.name;
            color.selected = true;
        }


        $scope.selected_package_code = 'single_vision';

        $scope.packages = {
            'single_vision' : {
                'name': 'Single Vision',
                'lens':{
                    'cr39' : {'name': 'CR-39', 'price': 39},
                    'poly' : {'name': 'Polycarbonate', 'price': 79},
                    'ulpoly' : {'name': 'High-Index', 'price': 99}
                },
                'upgrades': [1]
            },
            'multi_vision' : {
                'name': 'Progressive/Multifocal Lenses',
                'lens':{
                    'cr39' : {'name': 'CR-39', 'price': 79},
                    'poly' : {'name': 'Polycarbonate', 'price': 99},
                    'ulpoly' : {'name': 'High-Index', 'price': 139}
                },
                'upgrades': [1]
            },
            'reader' : {
                'name': 'Reader',
                'price': 39,
                'upgrades': [1]
            },
            'plano' : {
                'name': 'Blank Lenses',
                'price': 0,
                'upgrades': [1, 2]
            },
            'demo' : {
                'name': 'Frame Only',
                'price': 0,
                'upgrades': []
            }
        }

        $scope.packages.lens_choice = 'cr39';

        $scope.upgrades = [
            {name:'CleanShield', price: 49},
            {name:'Transitions', price: 99}
        ];


        $scope.changeSelectedPackage = function(selected_package_code){
            $scope.selected_package_code = selected_package_code;
        }

        $scope.getPriceOptions = function(){
            var price = 0;
            //lens options
            if($scope.selected_package_code == 'single_vision' || $scope.selected_package_code == 'multi_vision'){
                price = $scope.packages[$scope.selected_package_code].lens[$scope.packages.lens_choice].price;
            }
            else{
                price = $scope.packages[$scope.selected_package_code].price;
            }
            //upgrades
            if($scope.upgrades[0].selected){
                price += $scope.upgrades[0].price;
            }
            if($scope.upgrades[1].selected){
                price += $scope.upgrades[1].price;
            }
            return price;
        }

        $scope.isSaving = false;
        $scope.addToCart = function(productId){
            $scope.isSaving = true;
            var data = {
                productId: productId,
                color: $scope.selectedColorName
            }
            if($scope.packages[$scope.selected_package_code]){
                data.package = $scope.packages[$scope.selected_package_code].name;
            }
            if($scope.packages[$scope.selected_package_code].lens[$scope.packages.lens_choice]){
                data.lens = $scope.packages[$scope.selected_package_code].lens[$scope.packages.lens_choice];
            }
            data.upgrades = [];
            if($scope.upgrades[0].selected){
                data.upgrades.push($scope.upgrades[0]);
            }
            if($scope.upgrades[1].selected){
                data.upgrades.push($scope.upgrades[1]);
            }

            data.price_options = $scope.getPriceOptions();

            CartService.addToCart(data).then(function() {
                $location.path('/cart');
                $scope.isSaving = false;
            }, function() {
                alert('add to cart error!');
                $scope.isSaving = false;
            });
        }

    }]);