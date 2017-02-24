myApp.compileProvider.directive("loginDirective", function() {
    return {
        restrict: "E",
        scope: {},
        templateUrl: '/app/components/directives/login/views/login-template.html',
        controller: 'loginDirectiveController'
    };
});
myApp.controllerProvider.register("loginDirectiveController", function( $scope, userService ) {
    $scope.isRequired = function( val ) {
        return !validate.isEmpty(val);
    };
    $scope.hasMinLength = function( val, min ) {
        if(min == undefined){
            min = 6;
        }
        var constraints = {
            from: {
                length: {
                    minimum: min
                }
            }
        };
        return !validate({ from: val }, constraints);
    };
    $scope.isEmail = function( emailValue ) {
        var constraints = {
            from: {
                email: true
            }
        };
        return !validate({ from: emailValue }, constraints);
    };
    $scope.acceptTerms = {check: false};
    $scope.isLogin = false;

    $scope.signIn = {};
    $scope.login = function() {
        async.auto({
            startLoading: function( cb ) {
                cb(null, true);
            },
            loginUser: [ 'startLoading', function( cb ) {
                var option = {
                    data: {
                        scope: 'website',
                        password: $scope.signIn.password,
                        identifier: $scope.signIn.identifier
                    }
                };
                userService.login(option).then(function( resp ) {
                    console.log("resp", resp);
                    if( resp.result ) {
                        cb(null, resp.data);
                    } else {
                        cb(resp.error);
                    }
                }).catch(function( error ) {
                    cb(error);
                });

            } ],
            updateUserStorage: [ 'loginUser', function( cb, result ) {
                var token = _.cloneDeep(result.loginUser.token);
                _.unset(result.loginUser, 'token');
                var localDB = new db('website', 'public');
                localDB.create();
                localDB.set('userObj', result.loginUser);
                localDB.set('isLogin', true);
                localDB.set('identifier', $scope.signIn.identifier);
                localDB.set('token', token);
                if($scope.rememberMe){
                    localDB.set('rememberMe', true);
                } else {
                    localDB.set('rememberMe', false);
                }
                cb(null, true);
            } ]
        }, function( err, results ) {
            if( err ) {
                console.log("err", err);
            } else {
                $scope.isLogin = true;
                $('#login-form').modal("hide");

            }
            $scope.$apply();
        });
    };
});