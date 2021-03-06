/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.brand', []);

angular.module('myApp.brand').config(['$stateProvider', function($stateProvider) {

    $stateProvider
        .state('admin.brand', {
            url: "/brand",
            controller: 'AdminBrandListController',
            templateUrl: 'templates/admin/brands/list.html'
        })
        .state('admin.brand-add', {
            url: "/brand/add/{id}",
            templateUrl: 'templates/admin/brands/add.html',
            controller: 'AdminBrandAddController'
        })
    ;
}]);

/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.category', []);

angular.module('myApp.category').config(['$stateProvider', function($stateProvider) {

    $stateProvider
        .state('admin.category', {
            url: "/category",
            controller: 'AdminCategoryListController',
            templateUrl: 'templates/admin/categories/list.html'
        })
        .state('admin.category-add', {
            url: "/category/add/{id}",
            templateUrl: 'templates/admin/categories/add.html',
            controller: 'AdminCategoryAddController'
        })
    ;
}]);

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

/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.common',['smart-table', 'restangular']);

angular.module('myApp.common').config(function(RestangularProvider) {

    // add a response intereceptor
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        var extractedData;
        // .. to look for getList operations
        switch(operation)
        {
            case "getList":
                if(angular.isArray(data)){//not pagination
                    extractedData = data;
                }
                else{//pagination
                    extractedData = data.data;

                    extractedData.last_page = data.last_page;//set the number of pages so the pagination can update

                    extractedData.total = data.total;
                }
                break;

            default:
                extractedData = data;
                break;
        }

        return extractedData;
    });

    RestangularProvider.setRequestInterceptor(function(elem, operation) {
        if (operation === "remove") {
            return null;
        }
        return elem;
    });

    RestangularProvider.configuration.getIdFromElem = function(elem) {
        // if route is customers ==> returns customerID
        if(elem.route == "category"){
            return elem["category_id"];
        }
    }

});
var app = angular.module('myApp', [
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'ui.tinymce',
    'toaster',
    'ngFileUpload',
    'imagesLoaded',
    'myApp.common',
    'myApp.product',
    'myApp.category',
    'myApp.brand',
    'myApp.checkout'
]);

app.config(['$provide', Decorate]);

function Decorate($provide) {
    $provide.decorator('carouselDirective', function($delegate) {
        var directive = $delegate[0];

        directive.templateUrl = "/templates/custom/carousel.html";

        return $delegate;
    });
}

angular.module('myApp').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For any unmatched url, redirect to /
        $urlRouterProvider.otherwise("/");

        // Now set up the states
        $stateProvider
            .state('admin', {
                url: "/admin",
                templateUrl: "admin.html"
            })
            .state('front', {
                templateUrl: "front.html"
            })
            .state('front.home', {
                url: "/",
                controller: 'HomeController',
                templateUrl: "templates/front/home.html"
            })
        ;


    }]);


/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.product', []);

angular.module('myApp.product').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    // Now set up the states
    $stateProvider
        .state('admin.product', {
            url: "/product",
            controller: 'AdminProductListController',
            templateUrl: 'templates/admin/products/list.html'
        })
        .state('admin.product-add', {
            url: "/product/add/{id}",
            controller: 'AdminProductAddController',
            templateUrl: 'templates/admin/products/add.html'
        })
        .state('front.products', {
            url: "/products",
            controller: 'ProductListController',
            templateUrl: 'templates/products/list.html'
        })
        .state('front.product', {
            url: "/product/{alias}",
            controller: 'ProductViewController',
            templateUrl: 'templates/products/view.html'
        })
    ;


}]);

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
/**
 * Created by doanthuan on 4/12/2015.
 */
angular.module('myApp.common').directive('appGrid', ['Restangular', 'toaster', '$location', '$state', '$sce',
    function (Restangular, toaster, $location, $state, $sce) {
    return {
        restrict: 'E',
        templateUrl: '/templates/common/directives/grid.html',
        scope: {
            url: '@',
            cols: '=',
            items: '=',
            itemKey: '@',
            action: '@?'
        },
        controller: function($scope, $element){
            $scope.getPage = function (tableState) {

                $scope.isLoading = true;

                var pagination = tableState.pagination;
                if(pagination.number == undefined){
                    return false;
                }

                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                var page = start / pagination.number + 1;

                var searchParams = tableState.search.predicateObject;
                var orderBy = tableState.sort.predicate;
                var orderDir = tableState.sort.reverse?1:0;

                var params = {
                    limit: number,
                    page: page,
                    filters: searchParams,
                    order: orderBy,
                    dir: orderDir
                };

                Restangular.all($scope.url).getList(params).then(function(items) {

                    tableState.pagination.numberOfPages = items.last_page;//set the number of pages so the pagination can update

                    $scope.items = items;

                    $scope.total = items.total;

                    $scope.isLoading = false;
                });


            };

            $scope.checkAll = function(){
                angular.forEach($scope.items, function (item) {
                    item.selected = !$scope.selectedAll;
                });
            }

            $scope.editItem = function(item){
                var curUrl = $location.path();
                $location.path(curUrl + '/add/'+ item[$scope.itemKey]);
            }

            $scope.viewItem = function(item){
                var curUrl = $location.path();
                $location.path(curUrl + '/view/'+ item[$scope.itemKey]);
            }

            $scope.deleteItems = function(){

                $scope.isLoading = true;

                var deletedIds = [];
                var deletedItems = [];
                angular.forEach($scope.items, function (item) {
                    if(item.selected){
                        deletedIds.push(item[$scope.itemKey]);
                        deletedItems.push(item);
                    }
                });

                Restangular.all($scope.url + '/delete').post({'cid': deletedIds}).then(
                    function(response){
                        angular.forEach(deletedItems, function (item) {
                            var index = $scope.items.indexOf(item);
                            $scope.items.splice(index, 1);
                        });

                        if($scope.items.length == 0){
                            $state.reload();
                        }

                        $scope.isLoading = false;

                        toaster.pop('success', "", response.message);
                    },
                    function(response){
                        $scope.isLoading = false;

                        toaster.pop('error', "", response.data.message);
                    }
                );

            }

            $scope.$parent.$on('delete_item', function(e, data){
                $scope.deleteItems();
            });


            //action buttons
            if($scope.action == undefined){
                $scope.action = 'edit';
            }
        }
    }
}]);

angular.module('myApp.common').filter('picker', function($filter) {
    return function(value, filterName) {
        if(filterName){
            if(filterName == 'status'){
                if(value == 1){
                    return 'Enabled';
                } else{
                    return 'Disabled';
                }
            }
            else if(filterName == 'yes-no'){
                if(value == 1){
                    return 'Yes';
                } else{
                    return 'No';
                }
            }
            else if(filterName == 'order-status'){
                switch(value){
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
            else{
                return $filter(filterName)(value);
            }
        }
        else{
            return value;
        }
    };
});
/**
 * Created by doanthuan on 4/12/2015.
 */

angular.module('myApp.common').directive('appPagination', function () {
    return {
        restrict: 'E',
        scope: {
            'total': '='
        },
        templateUrl: '/templates/common/directives/pagination.html',
        link: function (scope, elem, attrs) {

        }
    }
});
/**
 * Created by doanthuan on 4/18/2015.
 */
angular.module('myApp.common').directive('appSpinner', function () {
    return {
        restrict: 'E',
        template: '<div class="app-spinner">' +
        '<span class="fa fa-spinner fa-spin"></span>' +
        '</div>'
    };
});
/**
 * Created by doanthuan on 4/12/2015.
 */
angular.module('myApp.common').directive('appToolbar', ['$location', function ($location) {
    return {
        restrict: 'E',
        scope: {
            'pageTitle': '@',
            'buttons': '='
        },
        templateUrl: '/templates/common/directives/toolbar.html',
        controller: function($scope, $element){
            $scope.initButtons = function(){
                $scope.toolbarButtons = [];
                if($scope.buttons){
                    $scope.buttons.forEach(function(aButton){

                        if(typeof aButton == 'string'){
                            aButton = {name:aButton};
                        }
                        var buttonName = aButton.name;

                        var button = null;
                        switch(buttonName){
                            case 'add':
                                button = {
                                    text: 'Add New',
                                    class: 'btn-success',
                                    icon: 'glyphicon glyphicon-plus',
                                    click: function(){
                                        var curUrl = $location.path();
                                        $location.path(curUrl + '/add');
                                    }
                                };
                                break;
                            case 'delete':
                                button = {
                                    text: 'Delete',
                                    class: 'btn-danger',
                                    icon: 'glyphicon glyphicon-remove',
                                    click: function(){
                                        $scope.$parent.$emit('delete_item');
                                    }
                                };
                                break;
                            case 'save':
                                button = {
                                    text: 'Save',
                                    class: 'btn-primary',
                                    click: function(){
                                        $scope.$parent.$emit('save_item');
                                    }
                                };
                                break;
                            case 'cancel':
                                button = {
                                    text: 'Cancel',
                                    class: 'btn-default',
                                    click: function(){
                                        window.history.back();
                                    }
                                };
                                break;
                            default :
                                button = {
                                    text: 'Undefined',
                                    class: 'btn-default'
                                };
                                break;
                        }
                        var mergedButton = angular.extend(button, aButton);

                        $scope.toolbarButtons.push(mergedButton);

                    });
                }
            }

            $scope.initButtons();

        }
    }
}]);
/**
 * Created by doanthuan on 4/28/2015.
 */
angular.module('myApp').controller('HomeController', ['$scope', function($scope) {

    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function(i) {
        slides.push({
            image: '/images/banner'+i+'.jpg',
            text: ''
        });
    };
    for (var i=1; i<4; i++) {
        $scope.addSlide(i);
    }

    $('.carousel').carousel();

}]);

/**
 * Created by doanthuan on 4/28/2015.
 */
angular.module('myApp').controller('MainController', ['$scope', '$location', function($scope, $location) {

    //detect admin area
    $scope.isAdmin = false;
    var path = $location.path();
    if( path.indexOf("admin") > 0 ){
        $scope.isAdmin = true;
    }

    if( path.indexOf("product") > 0 ){
        $scope.curPage = 'product';
        if( path.indexOf("products") > 0 ){
            $scope.curPage = 'products';
        }
    }

    if( path.indexOf("cart") > 0 ){
        $scope.curPage = 'cart';
    }

}]);

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
/**
 * Created by doanthuan on 4/12/2015.
 */

angular.module('myApp.product').factory('ProductService', [
        function() {

            var service = {};

            service.getColors = function(){
                return [
                    {id: 1, name:'SHINY BLACK', class: 'black'},
                    {id: 2, name:'BLACK & TEXTURE', class: 'black2'},
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
                    {id: 15, name:'DARK RED TRANSPARENT', class: 'red'},
                    {id: 16, name:'Silver', class: 'silver'},
                    {id: 17, name:'DARK HAVANA', class: 'tortoise'},
                    {id: 18, name:'Turquoise', class: 'turquoise'},
                    {id: 19, name:'White', class: 'white'},
                    {id: 20, name:'Yellow', class: 'yellow'}
                ];
            }

            service.getColorById = function(colorId){
                var colors = service.getColors();
                var retColor = null;
                angular.forEach(colors, function(color){
                    if(color.id == colorId){
                        retColor = color;
                        return;
                    }
                })
                return retColor;
            }

            service.colorIdsToObjects = function(item){
                if(item.colors != null) {
                    //format colors objects
                    var itemColors = [];
                    angular.forEach(item.colors, function (color) {
                        var newColor = service.getColorById(color.colorId);
                        newColor.images = color.images;
                        itemColors.push(newColor);
                    })
                    itemColors[0].active = true;
                    item.colors = itemColors;
                }
            }

            service.colorIdsToObjectsThumbnail = function(item){
                if(item.colors != null) {
                    //format colors objects
                    var itemColors = [];
                    var colorIds = item.colors.split(',');
                    var images = item.images.split(',');

                    for(var i = 0 ; i < colorIds.length; i++){
                        var newColor = service.getColorById(colorIds[i]);
                        newColor.thumbnail = images[i];
                        itemColors.push(newColor);
                    }
                    itemColors[0].active = true;
                    item.colors = itemColors;
                }
            }

            service.getFaceShapes = function(){
                return [
                    {id: 1, name: 'Heart', class: 'heart'},
                    {id: 2, name: 'Oblong', class: 'oblong'},
                    {id: 3, name: 'Oval', class: 'oval'},
                    {id: 4, name: 'Round', class: 'round'},
                    {id: 5, name: 'Square', class: 'square'},
                ];
            }

            service.getFrameSizes = function(){
                return [
                    {id: 1, name: 'Large'},
                    {id: 2, name: 'Medium'},
                    {id: 3, name: 'Small'},
                    {id: 4, name: 'Petite'}
                ];
            };

            service.getFrameTypes = function(){
                return [
                    {id: 1, name: 'Full-Rim Metal'},
                    {id: 2, name: 'Full-Rim Plastic'},
                    {id: 3, name: 'Full-Rim Wood'},
                    {id: 4, name: 'Rimless'},
                    {id: 5, name: 'Semi-Rimless'},
                ];
            }

            service.getFrameShapes = function() {
                return [
                    {id: 1, name: 'Butterfly', class: 'butterfly'},
                    {id: 2, name: 'Cat-Eye', class: 'cat-eye'},
                    {id: 3, name: 'Geometric', class: 'geometric'},
                    {id: 4, name: 'Oval', class: 'oval'},
                    {id: 5, name: 'Rectangle', class: 'rectangle'},
                    {id: 6, name: 'Round', class: 'round'},
                    {id: 7, name: 'Square', class: 'square'}
                ];
            }

            service.getFilterPrices = function() {
                return [
                    {id: '50 and 100', name: '$50 - $100'},
                    {id: '100 and 150', name: '$100 - $150'},
                    {id: '150 and 200', name: '$150 - $200'},
                    {id: '200 and 250', name: '$200 - $250'},
                    {id: '250 and 300', name: '$250 - $300'},
                    {id: '300 and 1000000', name: 'Over $300'},
                ];
            }

            return service;
        }]
);
/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.brand').controller('AdminBrandAddController',
    ['$scope','$location', 'toaster', 'Restangular', '$stateParams',
        function($scope, $location, toaster, Restangular, $stateParams) {

            $scope.cancel = function(){
                $location.path('/admin/brand');
            };

            $scope.save = function(){
                $scope.isSaving = true;
                Restangular.all('brand').post($scope.brand).then(
                    function(response){
                        toaster.pop('success', "", response.message);
                        $location.path('/admin/brand');
                        $scope.isSaving = false;
                    },
                    function(error){
                        toaster.pop('error', "", error.data.message);
                        $scope.isSaving = false;
                    }
                );
            };

            if($stateParams.id){
                $scope.isEdit = true;
                Restangular.one('brand', $stateParams.id).get().then(function(response){
                    $scope.brand = response;
                });

            }else{
                $scope.isEdit = false;
                $scope.brand = {};
            }


        }]);
/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.brand').controller('AdminBrandListController', ['$scope', 'Restangular', 'toaster', '$location',
    function($scope, Restangular, toaster, $location) {

    $scope.add = function(){
        $location.path('/admin/brand/add/');
    };

    $scope.remove = function(){
        //emit delete event to grid
        $scope.$emit('delete_item');
    };

    $scope.gridCols = [
        {title: 'Name', name: 'name', search: 'text'},
        {title: 'For Men', name: 'for_men', format: 'yes-no'},
        {title: 'For Women', name: 'for_women', format: 'yes-no'}
    ];

    $scope.brands = null;


}]);
/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryAddController',
    ['$scope','$location', 'toaster', 'Restangular', '$stateParams',
        function($scope, $location, toaster, Restangular, $stateParams) {

            $scope.cancel = function(){
                $location.path('/admin/category');
            };

            $scope.save = function(){
                $scope.isSaving = true;
                Restangular.all('category').post($scope.category).then(
                    function(response){
                        toaster.pop('success', "", response.message);
                        $location.path('/admin/category');
                        $scope.isSaving = false;
                    },
                    function(error){
                        toaster.pop('error', "", error.data.message);
                        $scope.isSaving = false;
                    }
                );
            };

            if($stateParams.id){
                $scope.isEdit = true;
                Restangular.one('category', $stateParams.id).get().then(function(response){
                    $scope.category = response;
                });

            }else{
                $scope.isEdit = false;
                $scope.category = {};
            }

            //$scope.isLoading = true;
            //Restangular.all('category').getList().then(function(items) {
            //
            //    $scope.categories = items;
            //    $scope.isLoading = false;
            //});


        }]);
/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryListController', ['$scope', 'Restangular', 'toaster', '$location',
    function($scope, Restangular, toaster, $location) {

    $scope.add = function(){
        $location.path('/admin/category/add/');
    };

    $scope.remove = function(){
        //emit delete event to grid
        $scope.$emit('delete_item');
    };

    $scope.gridCols = [
        {title: 'Name', name: 'name', search: 'text'},
        {title: 'Child Count', name: 'child_count', search: 'text'}
    ];

    $scope.categories = null;


}]);
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
/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('AdminProductAddController',
    ['$scope','$location', 'toaster', 'Restangular', '$stateParams', 'Upload', 'ProductService',
        function($scope, $location, toaster, Restangular, $stateParams, Upload, ProductService) {

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

            //init data
            $scope.genders = [
                {id: 1, name: 'Women'},
                {id: 2, name: 'Men'},
                {id: 3, name: 'Unisex'}
            ];

            $scope.colors = ProductService.getColors();

            $scope.shapes = ProductService.getFaceShapes();

            $scope.frameSizes = ProductService.getFrameSizes();

            $scope.frameTypes = ProductService.getFrameTypes();

            $scope.frameShapes = ProductService.getFrameShapes();


            $scope.isLoading = true;
            Restangular.all('category').getList().then(function(items) {

                $scope.categories = items;
                $scope.isLoading = false;

            });

            Restangular.all('brand').getList().then(function(items) {

                $scope.brands = items;
                $scope.isLoading = false;
            });

            $scope.product = {};
            if($stateParams.id){
                $scope.isEdit = true;
                Restangular.one('product', $stateParams.id).get().then(function(response){
                    $scope.product = response;
                });

            }else{
                $scope.isEdit = false;
            }


        }]);
/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('AdminProductListController', ['$scope', 'Restangular', 'toaster', '$location',
    function($scope, Restangular, toaster, $location) {

    $scope.add = function(){
        $location.path('/admin/product/add/');
    };

    $scope.remove = function(){
        //emit delete event to grid
        $scope.$emit('delete_item');
    };

    $scope.gridCols = [
        {title: 'Name', name: 'name', search: 'text'},
        {title: 'Price', name: 'price', search: 'text', format: 'currency'},
        {title: 'Created At', name: 'created_at', format: 'date'},
        {title: 'Status', name: 'status', format: 'status'}
        ];

    $scope.products = null;

}]);
//# sourceMappingURL=app.js.map