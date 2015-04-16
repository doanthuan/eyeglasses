/**
 * Created by doanthuan on 4/12/2015.
 */

angular.module('myApp.common').directive('appPagination', function () {
    return {
        restrict: 'E',
        scope: {
            'total': '='
        },
        templateUrl: '/templates/common/directives/pagination.html',
        link: function (scope, elem, attrs) {

        }
    }
});