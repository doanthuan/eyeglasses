var app = angular.module('myApp', ['myApp.product']);

/**
 * Created by doanthuan on 4/9/2015.
 */
var myAppCommon = angular.module('myApp.common', []);


/**
 * Created by doanthuan on 4/9/2015.
 */
var myAppProduct = angular.module('myApp.product', ['ngRoute', 'ngResource', 'smart-table', 'myApp.common']);

myAppProduct.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'ProductListController',
            templateUrl: 'views/products/list.html'
        })
        .when('/admin', {
            controller: 'AdminProductListController',
            templateUrl: 'views/admin/products/list.html'
        })
}]);

/**
 * Created by doanthuan on 4/12/2015.
 */

myAppCommon.directive('pagination', function () {
    return {
        restrict: 'E',
        scope: {
            'total': '='
        },
        templateUrl: '/views/common/directives/pagination.html',
        link: function (scope, elem, attrs) {

        }
    }
});
/**
 * Created by doanthuan on 4/12/2015.
 */

myAppCommon.factory('PaginationService', [ '$http', function($http) {
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

myAppProduct.controller('ProductListController', ['$scope', 'Product', '$http', function($scope, Product, $http) {
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

myAppProduct.factory('Product', ['$resource',
    function($resource) {
        return $resource('/product/:id', {id: '@id'},{
                update: {
                    method: 'PUT'
                }
            }
        );
    }]
);

myAppProduct.factory('ProductService', ['$q', '$filter', '$timeout' , 'Product', function($q, $filter, $timeout, Product) {
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

myAppProduct.controller('AdminProductListController', ['$scope', 'Product' , 'PaginationService', '$http', function($scope, Product, PaginationService, $http) {

    $scope.getPage = function(tableState) {

        $scope.isLoading = true;

        PaginationService.getPage('/product', tableState, function(result){

            $scope.products = result.data;

            $scope.total = result.total;

            $scope.isLoading = false;
        });

    };


}]);
//# sourceMappingURL=app.js.map