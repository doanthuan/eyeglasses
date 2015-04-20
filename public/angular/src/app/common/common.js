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

    RestangularProvider.setRequestInterceptor(function(elem, operation) {
        if (operation === "remove") {
            return null;
        }
        return elem;
    });

    RestangularProvider.configuration.getIdFromElem = function(elem) {
        // if route is customers ==> returns customerID
        console.log(elem.route);
        if(elem.route == "category"){
            return elem["category_id"];
        }
    }

});