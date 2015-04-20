/**
 * Created by doanthuan on 4/9/2015.
 */
angular.module('myApp.common',['smart-table', 'restangular']);

angular.module('myApp.common').config(function(RestangularProvider) {

    // add a response intereceptor
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        var extractedData;
        // .. to look for getList operations
        if (operation === "getList") {
            // .. and handle the data and meta data
            extractedData = data.data;

            extractedData.last_page = data.last_page;//set the number of pages so the pagination can update

            extractedData.total = data.total;

        } else {
            extractedData = data.data;
        }
        return extractedData;
    });

});