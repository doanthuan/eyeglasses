/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').factory('Category', ['$resource',
    function($resource) {
        return $resource('/category/:id', {id: '@id'},{
                update: {
                    method: 'PUT'
                }
            }
        );
    }]
);
