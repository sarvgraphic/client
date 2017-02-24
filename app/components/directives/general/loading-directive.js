myApp.compileProvider.directive('loadingDirective', function() {
    return {
        restrict: 'E',
        templateUrl: function() {
            return "/app/components/directives/general/views/loading-template.html";
        },
        scope: {},
        controller: function() {}
    };
});