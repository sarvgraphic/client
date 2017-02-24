myApp.compileProvider.directive('passwordDirective', function( settings ) {

    return {
        restrict: 'E',
        scope: {
            password: "="
        },
        
        templateUrl: '/app/components/directives/password/views/password-directive.html',
        controller: function($scope) {
            $scope.changePassword = false;

            $scope.changePasswordFun = function () {
                console.log($scope.changePassword);
                $scope.password.password = "";
            };
        }
    };
});


myApp.compileProvider.directive("passwordInputsDirective", function () {
    return {
        restrict : "E",
        scope : {
            editPassword : "="
        },
        templateUrl : '/app/components/directives/password/views/password-inputs-directive.html',
        controller : function ($scope) {

            $scope.isRequired = function (val) {
                return !validate.isEmpty(val);
            };
            
            $scope.hasMinLength = function( val ) {
                var constraints = {
                    from: {
                        length: {
                            minimum: 8
                        }
                    }
                };
                return !validate({ from: val }, constraints);
            };

            $scope.emptyConfirmpass = function() {
                $scope.confirmPassword = "";
            };

            $scope.confirmPass = function( confirmPasswordValue ) {
                var constraints = {
                    confirmPassword: {
                        equality: "password"
                    }
                };
                return !validate({
                    password: $scope.editPassword, confirmPassword: confirmPasswordValue
                }, constraints);
            };

            
        }
    }
});