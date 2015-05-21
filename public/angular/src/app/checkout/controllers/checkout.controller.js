/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('CheckoutController', ['$scope', 'Restangular', 'CheckoutService', '$location', 'toaster',
    function($scope, Restangular, CheckoutService, $location, toaster) {

        $scope.shipping = {};
        $scope.billing = {};
        $scope.payment = {};
        $scope.shipToBill = 1;

        $scope.cart = {};
        $scope.loadCart = function(){
            $scope.isLoading = true;
            Restangular.all('cart').customGET('').then(function(data) {
                $scope.cart = data;
                $scope.isLoading = false;
            }, function(data) {
                alert('Cart is empty');
                $location.path('/');
            });
        }
        $scope.loadCart();

        $scope.saveBillShip = function(){
            $scope.paymentOpen = true;
        }

        $scope.submitCheckout = function() {
            var $form = $('#payment-form');

            Stripe.card.createToken($form, stripeResponseHandler);

            // Prevent the form from submitting with the default action
            return false;
        };

        function stripeResponseHandler(status, response) {

            if (response.error) {
                // Show the errors on the form
                var $form = $('#payment-form');
                $form.find('.payment-errors').text(response.error.message);
                $form.find('button').prop('disabled', false);
            } else {
                // response contains id and card, which contains additional card details
                var token = response.id;
                $scope.payment.token = token;

                // and submit
                $scope.placeOrder();
            }
        };

        $scope.isSaving = false;
        $scope.placeOrder = function(){

            var data = {};
            data.shipping = $scope.shipping;
            if($scope.shipToBill == 1){
                $scope.billing = $scope.shipping;
            }
            data.billing = $scope.billing;
            data.payment = $scope.payment;
            data.cart = $scope.cart;

            $scope.isSaving = true;
            Restangular.all('checkout').customPOST(data, 'place-order').then(function(data) {
                toaster.pop('success', "", data.message);
                $location.path('/products');
            }, function(data) {
                toaster.pop('error', "", "Place order error!");
                $location.path('/products');
            });
        }

        $scope.oneAtATime = true;
        $scope.billShipOpen = true;
        $scope.paymentOpen = false;
    }]);