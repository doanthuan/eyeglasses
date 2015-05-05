/**
 * Created by doanthuan on 4/28/2015.
 */
angular.module('myApp').controller('HomeController', ['$scope', function($scope) {

    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function(i) {
        slides.push({
            image: '/images/banner'+i+'.jpg',
            text: ''
        });
    };
    for (var i=1; i<4; i++) {
        $scope.addSlide(i);
    }

    $('.carousel').carousel();

}]);
