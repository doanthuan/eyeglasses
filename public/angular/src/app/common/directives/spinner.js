/**
 * Created by doanthuan on 4/18/2015.
 */
angular.module('myApp.common').directive('appSpinner', function () {
    return {
        restrict: 'E',
        template: '<div class="app-spinner">' +
        '<span class="fa fa-spinner fa-spin"></span>' +
        '</div>'
    };
});