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