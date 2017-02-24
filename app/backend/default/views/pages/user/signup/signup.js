
myApp.controllerProvider.register('signUpCtrl', [ '$scope', 'settings', '$rootScope', '$state', 'userService', '$localStorage', '$q', 'loader','$timeout', function( $scope, settings, $rootScope, $state, userService, $localStorage, $q, loader, $timeout ) {

    /**
     * check template and login status
     */
    if( $localStorage[ $localStorage.appCurrentPath ] && $localStorage[ $localStorage.appCurrentPath ].isLogin ) {
        $scope.$emit("changeBackendTemp", true, $state.current.name);
    } else {
        $scope.$emit("changeBackendTemp", false, $state.current.name);
    }

    /* validations */
    $scope.isRequired = function( val ) {
        return !validate.isEmpty(val);
    };

    $scope.hasMinLength = function( val ) {
        var constraints = {
            from: {
                length: {
                    minimum: 6
                }
            }
        };
        return !validate({ from: val }, constraints);
    };

    $scope.emptyConfirmpass = function() {
        $scope.signUpFields.confirmPassword = "";
    };

    $scope.confirmPass = function( confirmPasswordValue ) {
        var constraints = {
            confirmPassword: {
                equality: "password"
            }
        };
        return !validate({
            password: $scope.signUpFields.password, confirmPassword: confirmPasswordValue
        }, constraints);
    };

    $scope.isEmail = function( emailValue ) {
        var constraints = {
            from: {
                email: true
            }
        };
        return !validate({ from: emailValue }, constraints);
    };

    $scope.emailExist = function( emailValue ) {
        var option = {
            config: {}, params: {}, where: {
                email: emailValue
            }
        };
        var defer = $q.defer();
        userService.findWhere(option).then(function( result ) {
            if( result.length == 0 ) {
                defer.resolve();
            } else {
                defer.reject();
            }
        }).catch(function( error ) {
            defer.reject();
        });
        return defer.promise;
    };

    $scope.userNameExist = function( userNameValue ) {
        var option = {
            config: {}, params: {}, where: {
                username: userNameValue
            }
        };
        var defer = $q.defer();
        userService.findWhere(option).then(function( result ) {
            if( result.length == 0 ) {
                defer.resolve();
            } else {
                defer.reject();
            }
        }).catch(function( error ) {
            defer.reject();
        });
        return defer.promise;
    };

    // $scope.$on('$stateChangeSuccess', function( event, toState, toParams, fromState, fromParams ) {
    //     if( toState.name == "vendorUrlNameBackend.signUp" ) {
    //         settings.currentLayout.currentTemp = "login";
    //         $rootScope.rootCurrentLayout = settings.currentLayout.currentTemp;
    //
    //     }
    //     if( fromState.name == "vendorUrlNameBackend.dashboard" ) {
    //         if( $localStorage[ $localStorage.appCurrentPath ].isLogin ) {
    //             settings.currentLayout.currentTemp = "dashboard";
    //             $rootScope.rootCurrentLayout = settings.currentLayout.currentTemp;
    //             $state.go("vendorUrlNameBackend.dashboard");
    //         } else {
    //             settings.currentLayout.currentTemp = "login";
    //             $rootScope.rootCurrentLayout = settings.currentLayout.currentTemp;
    //             $state.go("vendorUrlNameBackend.login");
    //         }
    //     }
    // });



    $scope.signUpFields = {
        "companyName": "",
        "companyPosition": "",
        "firstname": "",
        "lastname": "",
        "username": "",
        "password": "",
        "email": "",
        "userType": "",
        "addressList": [ {
            "title": "default",
            "address": "",
            "zip": "",
            "city": "",
            "country": "",
            "county": "",
            "state": "",
            "default": "yes"
        } ],
        "phoneList": [ {
            "title": "cellphone", "number": "", "default": "yes"
        }, {
            "title": "phone", "number": "", "default": "no"
        }, {
            "title": "fax", "number": "", "default": "no"
        } ],
        "isActive": true,
        "entityCollection": "vendor",
        "entityId": $localStorage[ $localStorage.appCurrentPath ].vendorObj.id || null
    };

    $scope.create = function() {

        async.auto({
            startLoading: function( callback ) {
                loader.show(".viewLoading");
                callback(null, true);
            }, createUser: [ 'startLoading', function( callback, result ) {
                var option = {
                    config: {}, params: $scope.signUpFields
                };
                userService.signup(option).then(function( result ) {
                    console.log("result : ", result);
                    if( result.result ) {
                        callback(null, result);
                    } else {
                        callback(result.error);
                    }

                }).catch(function( error ) {
                    console.log("error : ", error);
                    callback(error);
                });
            } ], updateUserStorage: [ 'createUser', function( callback, result ) {
                if( result.createUser ) {
                    $localStorage[ $localStorage.appCurrentPath ].isLogin = true;
                    $localStorage[ $localStorage.appCurrentPath ].userStorageObj = result.createUser.data;
                    $localStorage[ $localStorage.appCurrentPath ].userStorageObj.userType = result.createUser.data.entity.vendor.type;
                    callback(null, true);
                } else {
                    callback(null, false);
                }

            } ]
        }, function( err, results ) {

            if( err ) {
                toastr.error(err.message || "Unknown error", "", {timeOut: 3000});
                // App.alert({
                //     container: $('.viewLoading'),
                //     place: 'prepend',
                //     type: 'danger',
                //     message: util.parseErrorMessage(err),
                //     close: true,
                //     reset: true,
                //     focus: true,
                //     closeInSeconds: 5,
                //     icon: 'fa fa-warning'
                // });
            } else {
                // settings.currentLayout.currentTemp = "dashboard";
                // $rootScope.rootCurrentLayout = settings.currentLayout.currentTemp;
                $state.go("vendorUrlNameBackend.dashboard");
            }

            loader.hide(".viewLoading");
        });
    };

    $scope.signUpSubmit = function() {
        $scope.create();
    };

} ]);

