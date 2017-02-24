myApp.compileProvider.directive("imagesContentDirective", function() {
    return {
        restrict: "E",
        scope: {
            productConfigurable: "=?",

        },
        templateUrl: '/app/components/directives/images/views/images-content-template.html',
        controller: 'imagesContentDirectiveController'
    };
});
myApp.controllerProvider.register("imagesContentDirectiveController", function( $scope, $timeout, imageService ) {


    $scope.skip = 0;
    $scope.limit = 3;
    $scope.getImages = function(){
        async.auto({
            startLoading : function(cb){
                cb(null, true);
            },
            getImages : ['startLoading', function(cb, result){
                var option = {
                    data : {
                        skip : $scope.skip,
                        limit : $scope.limit
                    }
                };

                imageService.get_image(option).then(function(response){
                    console.log("response : ", response)
                    cb(null, response);
                }).catch(function(err){
                    cb(err);
                })
            }]
        }, function(err, result){
            if(err){

            }else{
                $scope.imagesData = result.getImages['results'];

                $timeout(function() {
                    $scope.$apply();
                    $('#masonry').masonry('reloadItems')
                    $('#masonry').masonry('layout')
                }, 100)
            }
        });
    }

    $scope.getImages();

    $scope.loadMore = function(){
        //$scope.skip = $scope.skip + 3;
        $scope.limit = $scope.limit + 3;
        $scope.getImages();
    }








})