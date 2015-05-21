/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.checkout').controller('AdminOrderViewController',
    ['$scope','$location', 'toaster', 'Restangular', '$stateParams',
        function($scope, $location, toaster, Restangular, $stateParams) {


            Restangular.one('order', $stateParams.id).get().then(function(response){
                $scope.order = response.order;
                $scope.billing = response.billing;
                $scope.shipping = response.shipping;
                $scope.orderItems = response.orderItems;
            });

            $scope.getOrderStatus = function(status) {
                switch(status){
                    case 1:
                        return 'Created';
                    case 2:
                        return 'Paid';
                    case 3:
                        return 'Completed';
                    case -1:
                        return 'Error';
                }
            }

        }]);