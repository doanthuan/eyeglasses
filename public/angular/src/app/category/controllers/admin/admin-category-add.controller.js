/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryAddController', ['$scope', '$http', function($scope, $http) {

    $scope.category = {};

    $scope.saveForm = function(){
        $http({
            method  : 'GET',
            url     : '/category/create',
            data    : $.param($scope.category),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function(data) {
                console.log(data);

                if (!data.success) {
                    // if not successful, bind errors to error variables
                    alert('error');
                } else {
                    // if successful, bind success message to message
                    $scope.message = data.message;
                }
            });
    };
}
]);