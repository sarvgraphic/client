
myApp.controllerProvider.register('SubscribeCtrl', function($scope) {
    $scope.change = function(){

        if($scope.switchStatus){
            console.log("sdsd", $scope.switchStatus)
            $scope.im1 = 199;
            $scope.im2 = 169;

        }else{

            $scope.im1 = 249;
            $scope.im2 = 199;
        }
    }
    $scope.switchStatus = true;
    $scope.change();

});