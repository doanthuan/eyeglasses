/**
 * Created by doanthuan on 4/12/2015.
 */

angular.module('myApp.common').directive('pagination', function () {
    return {
        restrict: 'E',
        scope: {
            'total': '='
        },
        templateUrl: '/views/common/directives/pagination.html',
        link: function (scope, elem, attrs) {

        }
    }
});