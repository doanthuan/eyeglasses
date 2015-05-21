/**
 * Created by doanthuan on 4/12/2015.
 */

angular.module('myApp.checkout').factory('CheckoutService', ['Restangular','$location',
        function(Restangular, $location) {

            var service = {};

            service.addToCart = function(data){
                var baseCart = Restangular.all('cart');
                return baseCart.customPOST(data, 'add');
            }

            service.removeFromCart = function(productId){
                var baseCart = Restangular.all('cart');
                return baseCart.customPOST({productId: productId}, 'remove');
            }

            service.getCartInfo = function(){
                var baseCart = Restangular.all('cart');
                baseCart.customGET('').then(function(data) {
                    return data;
                }, function() {
                    alert('cart items have error!');
                });
            }

            return service;
        }]
);