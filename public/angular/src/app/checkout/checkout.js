/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.checkout', []);

angular.module('myApp.checkout').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    // Now set up the states
    $stateProvider
        .state('front.cart', {
            url: "/cart",
            controller: 'CartController',
            templateUrl: 'templates/checkout/cart.html'
        })
        .state('front.checkout', {
            url: "/checkout",
            controller: 'CheckoutController',
            templateUrl: 'templates/checkout/checkout.html'
        })
        .state('admin.order', {
            url: "/order",
            controller: 'AdminOrderListController',
            templateUrl: 'templates/admin/orders/list.html'
        })
        .state('admin.order-view', {
            url: "/order/view/{id}",
            templateUrl: 'templates/admin/orders/view.html',
            controller: 'AdminOrderViewController'
        })

    ;


}]);
