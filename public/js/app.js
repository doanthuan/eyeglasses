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
    'myApp.common',
    'myApp.product',
    'myApp.category',
    'myApp.brand'
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
        .state('front.product', {
            url: "/products",
            controller: 'ProductListController',
            templateUrl: 'templates/products/list.html'
        })
    ;


}]);

/**
 * Created by doanthuan on 4/12/2015.
 */
angular.module('myApp.common').directive('appGrid', ['Restangular', 'toaster', '$location', '$state',
    function (Restangular, toaster, $location, $state) {
    return {
        restrict: 'E',
        templateUrl: '/templates/common/directives/grid.html',
        scope: {
            url: '@',
            cols: '=',
            items: '=',
            itemKey: '@'
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
                console.log(item);
                $location.path(curUrl + '/add/'+ item[$scope.itemKey]);
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

}]);

/**
 * Created by doanthuan on 4/12/2015.
 */

angular.module('myApp.product').factory('ProductService', [
        function() {

            var service = {};

            service.getColors = function(){
                return [
                    {id: 1, name:'Black', class: 'black'},
                    {id: 2, name:'Black 2', class: 'black2'},
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
                    {id: 15, name:'Red', class: 'red'},
                    {id: 16, name:'Silver', class: 'silver'},
                    {id: 17, name:'Tortoise', class: 'tortoise'},
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

                    if(item.colors != null) {
                        //convert color ids string to color objects
                        var colorIds = item.colors.split(',');
                        var itemColors = [];
                        angular.forEach(colorIds, function (colorId) {
                            var color = ProductService.getColorById(colorId);
                            itemColors.push(color);
                        })
                        itemColors[0].active = true;
                        item.colors = itemColors;
                    }
                });

                $scope.items = items;

                $scope.total = items.total;

                $scope.isLoading = false;
            });
        };
        $scope.getList();

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