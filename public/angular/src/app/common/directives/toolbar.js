/**
 * Created by doanthuan on 4/12/2015.
 */
angular.module('myApp.common').directive('appToolbar', ['$location', function ($location) {
    return {
        restrict: 'E',
        scope: {
            'pageTitle': '@',
            'buttons': '@'
        },
        templateUrl: '/templates/common/directives/toolbar.html',
        link:
        {
            pre: function (scope, elem, attrs) {
                var buttons = [];
                var buttonNameArr = scope.buttons.split(',');
                buttonNameArr.forEach(function(buttonName){
                    var button = null;
                    switch(buttonName){
                        case 'add':
                            button = {
                                text: 'Add New',
                                class: 'btn-success',
                                icon: 'glyphicon glyphicon-plus',
                                click: function(){
                                    var curUrl = $location.path();
                                    $location.path(curUrl + '/add');
                                }
                            };
                            break;
                        case 'delete':
                            button = {
                                text: 'Delete',
                                class: 'btn-danger',
                                icon: 'glyphicon glyphicon-remove'
                            };
                            break;
                        case 'save':
                            button = {
                                text: 'Save',
                                class: 'btn-primary',
                                click: function(){
                                    scope.$parent.saveForm();
                                }
                            };
                            break;
                        case 'cancel':
                            button = {
                                text: 'Cancel',
                                class: 'btn-default',
                                click: function(){
                                    window.history.back();
                                }
                            };
                            break;
                    }
                    buttons.push(button);
                });
                scope.toolbarButtons = buttons;
            }
        }
    }
}]);