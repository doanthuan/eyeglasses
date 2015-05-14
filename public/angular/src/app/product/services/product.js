/**
 * Created by doanthuan on 4/12/2015.
 */

angular.module('myApp.product').factory('ProductService', [
        function() {

            var service = {};

            service.getColors = function(){
                return [
                    {id: 1, name:'Black', class: 'black'},
                    {id: 2, name:'Black 2', class: 'black2'},
                    {id: 3, name:'Blue', class: 'blue'},
                    {id: 4, name:'Brown', class: 'brown'},
                    {id: 5, name:'Burgundy', class: 'burgundy'},
                    {id: 6, name:'Crystal', class: 'crystal'},
                    {id: 7, name:'Gold', class: 'gold'},
                    {id: 8, name:'Green', class: 'green'},
                    {id: 9, name:'Grey', class: 'grey'},
                    {id: 10, name:'Gunmetal', class: 'gunmetal'},
                    {id: 11, name:'Orange', class: 'orange'},
                    {id: 12, name:'Pink', class: 'pink'},
                    {id: 13, name:'Print', class: 'print'},
                    {id: 14, name:'Purple', class: 'purple '},
                    {id: 15, name:'Red', class: 'red'},
                    {id: 16, name:'Silver', class: 'silver'},
                    {id: 17, name:'Tortoise', class: 'tortoise'},
                    {id: 18, name:'Turquoise', class: 'turquoise'},
                    {id: 19, name:'White', class: 'white'},
                    {id: 20, name:'Yellow', class: 'yellow'}
                ];
            }

            service.getColorById = function(colorId){
                var colors = service.getColors();
                var retColor = null;
                angular.forEach(colors, function(color){
                    if(color.id == colorId){
                        retColor = color;
                        return;
                    }
                })
                return retColor;
            }

            service.getFaceShapes = function(){
                return [
                    {id: 1, name: 'Heart', class: 'heart'},
                    {id: 2, name: 'Oblong', class: 'oblong'},
                    {id: 3, name: 'Oval', class: 'oval'},
                    {id: 4, name: 'Round', class: 'round'},
                    {id: 5, name: 'Square', class: 'square'},
                ];
            }

            service.getFrameSizes = function(){
                return [
                    {id: 1, name: 'Large'},
                    {id: 2, name: 'Medium'},
                    {id: 3, name: 'Small'},
                    {id: 4, name: 'Petite'}
                ];
            };

            service.getFrameTypes = function(){
                return [
                    {id: 1, name: 'Full-Rim Metal'},
                    {id: 2, name: 'Full-Rim Plastic'},
                    {id: 3, name: 'Full-Rim Wood'},
                    {id: 4, name: 'Rimless'},
                    {id: 5, name: 'Semi-Rimless'},
                ];
            }

            service.getFrameShapes = function() {
                return [
                    {id: 1, name: 'Butterfly', class: 'butterfly'},
                    {id: 2, name: 'Cat-Eye', class: 'cat-eye'},
                    {id: 3, name: 'Geometric', class: 'geometric'},
                    {id: 4, name: 'Oval', class: 'oval'},
                    {id: 5, name: 'Rectangle', class: 'rectangle'},
                    {id: 6, name: 'Round', class: 'round'},
                    {id: 7, name: 'Square', class: 'square'}
                ];
            }

            service.getFilterPrices = function() {
                return [
                    {id: '50 and 100', name: '$50 - $100'},
                    {id: '100 and 150', name: '$100 - $150'},
                    {id: '150 and 200', name: '$150 - $200'},
                    {id: '200 and 250', name: '$200 - $250'},
                    {id: '250 and 300', name: '$250 - $300'},
                    {id: '300 and 1000000', name: 'Over $300'},
                ];
            }

            return service;
        }]
);