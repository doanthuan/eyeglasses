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
