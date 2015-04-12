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
