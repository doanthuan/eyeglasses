/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.checkout').controller('AdminOrderListController', ['$scope', 'Restangular', 'toaster', '$location',
    function($scope, Restangular, toaster, $location) {

        $scope.gridCols = [
            {title: 'Order Time', name: 'created_at'},
            {title: 'Amount', name: 'amount', search: 'text'},
            {title: 'Customer', name: 'customer_email', search: 'text'},
            {title: 'Status', name: 'status', format: 'order-status'}
        ];


    }]);