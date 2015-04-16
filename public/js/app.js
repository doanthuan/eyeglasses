var app = angular.module('myApp', ['ui.bootstrap', 'ui.tinymce', 'myApp.common', 'myApp.product', 'myApp.category']);

/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.category', ['ngRoute', 'ngResource']);

angular.module('myApp.category').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/admin/category', {
            controller: 'AdminCategoryListController',
            templateUrl: 'templates/admin/categories/list.html'
        })
        .when('/admin/category/add', {
            controller: 'AdminCategoryAddController',
            templateUrl: 'templates/admin/categories/add.html'
        })
}]);

/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.common',['smart-table']);


/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.product', ['ngRoute', 'ngResource']);

angular.module('myApp.product').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'ProductListController',
            templateUrl: 'templates/products/list.html'
        })
        .when('/admin/product', {
            controller: 'AdminProductListController',
            templateUrl: 'templates/admin/products/list.html'
        })
        .when('/admin/product/add', {
            controller: 'AdminProductAddController',
            templateUrl: 'templates/admin/products/add.html'
        })
}]);

/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').factory('Product', ['$resource',
    function($resource) {
        return $resource('/product/:id', {id: '@id'},{
                update: {
                    method: 'PUT'
                }
            }
        );
    }]
);

angular.module('myApp.product').factory('ProductService', ['$q', '$filter', '$timeout' , 'Product', function($q, $filter, $timeout, Product) {
            //fake call to the server, normally this service would serialize table state to send it to the server (with query parameters for example) and parse the response
            //in our case, it actually performs the logic which would happened in the server
            function getPage(start, number, params) {

                var deferred = $q.defer();

                var filtered = params.search.predicateObject ? $filter('filter')(randomsItems, params.search.predicateObject) : randomsItems;

                if (params.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
                }

                var result = filtered.slice(start, start + number);

                $timeout(function () {
                    //note, the server passes the information about the data set size
                    deferred.resolve({
                        data: result,
                        numberOfPages: Math.ceil(1000 / number)
                    });
                }, 1500);

                return deferred.promise;
            }

            return {
                getPage: getPage
            };
        }]
);

/**
 * Created by doanthuan on 4/12/2015.
 */
angular.module('myApp.common').directive('appGrid', ['PaginationService', function (PaginationService) {
    return {
        restrict: 'E',
        templateUrl: '/templates/common/directives/grid.html',
        scope: {
            url: '@',
            cols: '='
        },
        link: {
            pre: function (scope, element, attrs, ctrl) {

                scope.getPage = function(tableState) {

                    scope.isLoading = true;

                    PaginationService.getPage(scope.url, tableState, function(result){

                        scope.items = result.data;

                        scope.total = result.total;

                        scope.isLoading = false;
                    });

                };
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
 * Created by doanthuan on 4/12/2015.
 */
angular.module('myApp.common').directive('appToolbar', ['$location', function ($location) {
    return {
        restrict: 'E',
        scope: {
            'pageTitle': '@',
            'buttons': '@'
        },
        templateUrl: '/templates/common/directives/toolbar.html',
        link:
        {
            pre: function (scope, elem, attrs) {
                var buttons = [];
                var buttonNameArr = scope.buttons.split(',');
                buttonNameArr.forEach(function(buttonName){
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
                                icon: 'glyphicon glyphicon-remove'
                            };
                            break;
                        case 'save':
                            button = {
                                text: 'Save',
                                class: 'btn-primary',
                                click: function(){
                                    scope.$parent.saveForm();
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
                    }
                    buttons.push(button);
                });
                scope.toolbarButtons = buttons;
            }
        }
    }
}]);
/**
 * Created by doanthuan on 4/12/2015.
 */

angular.module('myApp.common').factory('PaginationService', [ '$http', function($http) {
        function getPage(url, tableState, callback) {

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

            $http(
                {
                    url : url,
                    method: 'GET',
                    params: params
                }
            )
            .success(function(result, status, headers, config) {

                tableState.pagination.numberOfPages = result.last_page;//set the number of pages so the pagination can update

                callback(result);

            })
            .error(function(data, status, headers, config) {

            });

        };
        return {
            getPage: getPage
        };
    }]
);
/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('ProductListController', ['$scope', 'Product', '$http', function($scope, Product, $http) {
    Product.query( {} ,function(products) {
        console.log(products);
        $scope.products = products;
    }, function(error) {
        console.log(error);
    });

}]);
/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').factory('Product', ['$resource',
    function($resource) {
        return $resource('/product/:id', {id: '@id'},{
                update: {
                    method: 'PUT'
                }
            }
        );
    }]
);

angular.module('myApp.product').factory('ProductService', ['$q', '$filter', '$timeout' , 'Product', function($q, $filter, $timeout, Product) {
            //fake call to the server, normally this service would serialize table state to send it to the server (with query parameters for example) and parse the response
            //in our case, it actually performs the logic which would happened in the server
            function getPage(start, number, params) {

                var deferred = $q.defer();

                var filtered = params.search.predicateObject ? $filter('filter')(randomsItems, params.search.predicateObject) : randomsItems;

                if (params.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
                }

                var result = filtered.slice(start, start + number);

                $timeout(function () {
                    //note, the server passes the information about the data set size
                    deferred.resolve({
                        data: result,
                        numberOfPages: Math.ceil(1000 / number)
                    });
                }, 1500);

                return deferred.promise;
            }

            return {
                getPage: getPage
            };
        }]
);

/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryAddController', ['$scope', '$http', function($scope, $http) {

    $scope.category = {};

    $scope.saveForm = function(){
        $http({
            method  : 'GET',
            url     : '/category/create',
            data    : $.param($scope.category),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function(data) {
                console.log(data);

                if (!data.success) {
                    // if not successful, bind errors to error variables
                    alert('error');
                } else {
                    // if successful, bind success message to message
                    $scope.message = data.message;
                }
            });
    };
}
]);
/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryListController', ['$scope', function($scope) {

    $scope.gridCols = [
        {title: 'Name', name: 'name', search: 'text'},
        {title: 'Child Count', name: 'child_count', search: 'text'}
    ];

}]);
/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('AdminProductAddController', ['$scope', function($scope) {

    $scope.tinymceOptions = {
        handle_event_callback: function (e) {
            // put logic here for keypress
        }
    };

}]);
/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.product').controller('AdminProductListController', ['$scope', function($scope) {

    $scope.gridCols = [
        {title: 'Name', name: 'name', search: 'text'},
        {title: 'Price', name: 'price', search: 'text', format: 'currency'},
        {title: 'Quantity', name: 'quantity', search: 'text'},
        {title: 'Created At', name: 'created_at', format: 'date'},
        {title: 'Status', name: 'status', format: 'status'}
    ];

}]);
//# sourceMappingURL=app.js.map