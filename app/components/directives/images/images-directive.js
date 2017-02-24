myApp.compileProvider.directive("imagesDirective", function() {
    return {
        restrict: "E",
        templateUrl: '/app/components/directives/images/views/images-template.html',
        controller: 'imagesDirectiveController'
    };
});
myApp.controllerProvider.register("imagesDirectiveController", function( $scope, $timeout ) {
console.log("sssssssss")

})