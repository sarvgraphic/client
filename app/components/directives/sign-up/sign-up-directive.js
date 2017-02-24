myApp.compileProvider.directive("signUpDirective", function() {
    return {
        restrict: "E",
        scope: {},
        templateUrl: '/app/components/directives/sign-up/views/sign-up-template.html',
        controller: 'sigUpDirectiveController'
    };
});
myApp.controllerProvider.register("sigUpDirectiveController", function( $scope, userService ) {
    $scope.isRequired = function( val ) {
        return !validate.isEmpty(val);
    };
    $scope.emailExist = function(val){
        return new Promise(function(resolve, reject){
            if(val != undefined){
                var option = {
                    data: {
                        email : val
                    }
                };
                userService.existEmail(option).then(function(resp){
                    if(resp.result){
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }).catch(function(){
                    reject(false);
                });
            } else {
                resolve(true);
            }
        });
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
    $scope.create = function() {
        async.auto({
            startLoading: function( cb ) {
                // loader.show("#signUpForm");
                cb(null, true);
            },
            createUser: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        scope: 'website',
                        email: $scope.email,
                        password: $scope.password
                    }
                };
                userService.signUp(option).then(function( resp ) {
                    if( resp.result ) {
                        cb(null, resp.data);
                    } else {
                        cb(result.error);
                    }
                }).catch(function( err ) {
                    cb(err);
                });
            } ],
            updateUserStorage: [ 'createUser', function( cb, result ) {
                var localDB = new db('website', 'public');
                localDB.create();
                localDB.set('userObj', result.createUser.user);
                localDB.set('isLogin', true);
                localDB.set('token', result.createUser.token);
            } ]
        }, function( err, results ) {

        });
    };
});