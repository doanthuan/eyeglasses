var app = angular.module('myApp', [
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'ui.tinymce',
    'toaster',
    'ngFileUpload',
    'myApp.common',
    'myApp.product',
    'myApp.category'
]);

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
                extractedData = data.data;

                extractedData.last_page = data.last_page;//set the number of pages so the pagination can update

                extractedData.total = data.total;

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
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('ProductListController', ['$scope', 'Restangular',
    function($scope, Restangular) {

    $scope.isLoading = true;
    Restangular.all('product').getList().then(function(items) {

        $scope.items = items;

        $scope.total = items.total;

        $scope.isLoading = false;
    });

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
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryAddController',
    ['$scope','$location', 'toaster', 'Restangular', '$stateParams',
    function($scope, $location, toaster, Restangular, $stateParams) {

    $scope.cancel = function(){
        $location.path('/admin/category');
    }

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
    }

    if($stateParams.id){
        $scope.isEdit = true;
        Restangular.one('category', $stateParams.id).get().then(function(response){
            $scope.category = response;
        });

    }else{
        $scope.isEdit = false;
        $scope.category = {};
    }

}
]);
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
    ['$scope','$location', 'toaster', 'Restangular', '$stateParams', 'Upload',
        function($scope, $location, toaster, Restangular, $stateParams, Upload) {

    $scope.cancel = function(){
        $location.path('/admin/product');
    }

    $scope.save = function(){
        $scope.isSaving = true;

        $scope.product.images = $scope.images;

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

    if($stateParams.id){
        $scope.isEdit = true;
        Restangular.one('product', $stateParams.id).get().then(function(response){
            $scope.product = response;
        });

    }else{
        $scope.isEdit = false;
        $scope.product = {};
    }


    $scope.tinymceOptions = {
        handle_event_callback: function (e) {
            // put logic here for keypress
        }
    };

    $scope.$watch('images', function () {
        $scope.upload($scope.images);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'media/upload',
                    fields: {'username': $scope.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    file.media_id = data;
                });
            }
        }
    };

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
        {title: 'Quantity', name: 'quantity', search: 'text'},
        {title: 'Created At', name: 'created_at', format: 'date'},
        {title: 'Status', name: 'status', format: 'status'}
        ];

    $scope.products = null;

}]);
//# sourceMappingURL=app.js.map