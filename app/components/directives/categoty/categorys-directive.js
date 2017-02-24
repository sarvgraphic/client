myApp.compileProvider.directive("categotysDirective", function() {
    return {
        restrict: "E",
        templateUrl: '/app/components/directives/categoty/views/categorys-template.html',
        controller: 'categorysDirectiveController'
    };
});
myApp.controllerProvider.register("categorysDirectiveController", function( $scope, categoryService ) {
    async.auto({
        startLoading : function(cb){
            cb(null, true);
        },
        getCategory : ['startLoading', function(cb, result){
            var option = {
                data : {}
            };

            categoryService.get_category(option).then(function(response){
                console.log("response : ", response)
                cb(null, response);
            }).catch(function(err){
                cb(err);
            })
        }]
    }, function(err, result){
        if(err){

        }else{
            $scope.categorys = result.getCategory['results'];
        }
    });
});