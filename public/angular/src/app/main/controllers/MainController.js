/**
 * Created by doanthuan on 4/28/2015.
 */
angular.module('myApp').controller('MainController', ['$scope', '$location', function($scope, $location) {

    //detect admin area
    $scope.isAdmin = false;
    var path = $location.path();
    if( path.indexOf("admin") > 0 ){
        $scope.isAdmin = true;
    }

    if( path.indexOf("product") > 0 ){
        $scope.curPage = 'product';
        if( path.indexOf("products") > 0 ){
            $scope.curPage = 'products';
        }
    }

    if( path.indexOf("cart") > 0 ){
        $scope.curPage = 'cart';
    }

}]);
