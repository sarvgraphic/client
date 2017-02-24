myApp.controllerProvider.register('forgotPasswordCtrl', function($document, $scope, userService){

    $scope.isRequired = function( val ) {
        return !validate.isEmpty(val);
    };
    $scope.isEmail = function( emailValue ) {
        var constraints = {
            from: {
                email: true
            }
        };
        return !validate({ from: emailValue }, constraints);
    };
});