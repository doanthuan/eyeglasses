/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').factory('Category', ['$resource',
    function($resource) {
        return $resource('/category/:id', {id: '@id'},{
                query:  {method:'GET', isArray:false,
                    transformResponse: function(data, header) {
                        var jsonData = JSON.parse(data); //or angular.fromJson(data)
                        var items = [];

                        angular.forEach(jsonData.data, function(item){
                            var category = new this;
                            category.category_id = item.category_id;
                            category.name = item.name;
                            category.child_count = item.child_count;
                            items.push(category);
                        });
                        return items;
                    }
                },
                update: {method: 'PUT'}
            }
        );
    }]
);
