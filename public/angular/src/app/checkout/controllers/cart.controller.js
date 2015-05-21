/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.checkout').controller('CartController', ['$scope', 'Restangular', 'CartService', '$location', '$timeout',
    function($scope, Restangular, CartService, $location, $timeout) {

        $scope.cart = {};
        $scope.loadCart = function(){
            $scope.isLoading = true;
            Restangular.all('cart').customGET('').then(function(data) {
                $scope.cart = data;
                $scope.isLoading = false;
            }, function() {
                alert('Can not get cart items!');
            });
        }
        $scope.loadCart();

        $timeout(function(){
            $('.zoomContainer').remove();
        });

        $scope.removeFromCart = function(productId){
            $scope.isLoading = true;
            CartService.removeFromCart(productId).then(function() {
                $scope.isLoading = false;
                $scope.loadCart();
            }, function() {
                alert('add to cart error!');
                $scope.isLoading = false;
            });
        }

    }]);