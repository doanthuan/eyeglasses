/**
 * Created by doanthuan on 4/12/2015.
 */

angular.module('myApp.checkout').factory('CartService', ['Restangular','$location',
        function(Restangular, $location) {

            var service = {};

            service.addToCart = function(data){
                return Restangular.all('cart').customPOST(data, 'add');
            }

            service.removeFromCart = function(productId){
                return Restangular.all('cart').customPOST({productId: productId}, 'remove');
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