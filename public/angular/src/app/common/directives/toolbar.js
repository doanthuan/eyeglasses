/**
 * Created by doanthuan on 4/12/2015.
 */
angular.module('myApp.common').directive('toolbar', function () {
    return {
        restrict: 'E',
        scope: {
            'pageTitle': '@'
        },
        templateUrl: '/views/common/directives/toolbar.html',
        link: function (scope, elem, attrs) {

        }
    }
});