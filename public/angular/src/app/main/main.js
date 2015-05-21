var app = angular.module('myApp', [
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'ui.tinymce',
    'toaster',
    'ngFileUpload',
    'imagesLoaded',
    'myApp.common',
    'myApp.product',
    'myApp.category',
    'myApp.brand',
    'myApp.checkout'
]);

app.config(['$provide', Decorate]);

function Decorate($provide) {
    $provide.decorator('carouselDirective', function($delegate) {
        var directive = $delegate[0];

        directive.templateUrl = "/templates/custom/carousel.html";

        return $delegate;
    });
}

angular.module('myApp').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For any unmatched url, redirect to /
        $urlRouterProvider.otherwise("/");

        // Now set up the states
        $stateProvider
            .state('admin', {
                url: "/admin",
                templateUrl: "admin.html"
            })
            .state('front', {
                templateUrl: "front.html"
            })
            .state('front.home', {
                url: "/",
                controller: 'HomeController',
                templateUrl: "templates/front/home.html"
            })
        ;


    }]);

