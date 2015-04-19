/**
 * Created by doanthuan on 4/9/2015.
 */

angular.module('myApp.category').controller('AdminCategoryAddController', ['$scope','$location', 'Category', 'toaster',
    function($scope, $location, Category, toaster) {

    $scope.buttons = [
        {
            name: 'save',
            click: function(){
                $scope.saveItem();
            }
        },
        'cancel'
    ];

    $scope.category = new Category();

    $scope.saveItem = function(){
        $scope.category.$save({},
            function(response){
                toaster.pop('success', "", response.message);
                $location.path('/admin/category');
            },
            function(response){
                toaster.pop('error', "", response.message);
                console.log(result);
            }
        );
    };
}
]);