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