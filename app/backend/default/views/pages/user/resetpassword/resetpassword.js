
myApp.controllerProvider.register('resetpasswordCtrl', [ '$scope', '$localStorage', 'settings', '$rootScope', '$state', '$timeout', 'userService', 'vendorService', '$stateParams', '$location', 'loader',
    function( $scope, $localStorage, settings, $rootScope, $state, $timeout, userService, vendorService, $stateParams, $location, loader ) {


        /**
         * check template and login status
         */
        if( $localStorage[ $localStorage.appCurrentPath ] && $localStorage[ $localStorage.appCurrentPath ].isLogin ) {
            $scope.$emit("changeBackendTemp", true, $state.current.name);
        } else {
            $scope.$emit("changeBackendTemp", false, $state.current.name);
        }

        $scope.localStorageAddress = $localStorage[ $localStorage.appCurrentPath ];
        $scope.notValidBoxName = $scope.localStorageAddress.vendorObj.name;

        /**
         * check vendor status in client side
         */
        if(!$localStorage[ $localStorage.appCurrentPath ].vendorObj.isActive){
            $scope.isValid = false;
            $scope.notValidText = $scope.notValidBoxName + " is inactive in the system.";
        } else if ($localStorage[ $localStorage.appCurrentPath ].vendorObj.isBanned){
            $scope.isValid = false;
            $scope.notValidText = $scope.notValidBoxName + " is banned in the system.";
        }else if($localStorage[ $localStorage.appCurrentPath ].vendorObj.isExpired){
            $scope.isValid = false;
            $scope.notValidText = $scope.notValidBoxName + " is expired in the system.";
        }else{
            $scope.isValid = true;
        }

        
        /**
         * boolean type casting
         */
        if( !$stateParams.resetKey ) {
            async.auto({
                "setState": function( callback ) {
                    settings.currentLayout.currentTemp = "default";
                    $rootScope.rootCurrentLayout = settings.currentLayout.currentTemp;
                    callback(null, $rootScope.rootCurrentLayout);
                }
            }, function( error, result ) {
                $state.go("default");
            });
        }

        $scope.emptyConfirmpass = function() {
            $scope.confirmPassword = "";
        };

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
        $scope.confirmPass = function( confirmPasswordValue ) {
            var constraints = {
                confirmPassword: {
                    equality: "password"
                }
            };
            return !validate({ password: $scope.password, confirmPassword: confirmPasswordValue }, constraints);
        };

        $scope.rememberMeChange = function() {
            $localStorage[ $localStorage.appCurrentPath ].rememberMe = $scope.rememberMe;
        };

      

        $scope.resetPass = function() {
            async.auto({
                startLoading: function( callback ) {
                    loader.show(".viewLoading");
                    $scope.vendorUrl = $localStorage[ $localStorage.appCurrentPath ].vendorObj.nameUrl || null;
                    callback(null, $scope.vendorUrl);
                }, resetFun: [ 'startLoading', function( callback, result ) {
                    var option = {
                        config: {}, params: {
                            newPassword: $scope.password,
                            resetKey: $stateParams.resetKey,
                            entityUrl: result.startLoading,
                            entityType: "vendor"
                        }
                    };
                    userService.resetPassword(option).then(function( userLoginData ) {
                        if( userLoginData.result ) {
                            callback(null, userLoginData);
                        } else {
                            callback(userLoginData.error);
                        }


                    }).catch(function( error ) {
                        callback(error);
                    });
                } ], errorHandling: [ 'resetFun', function( callback, result ) {
                    if( result.resetFun ) {
                        App.alert({
                            container: $('.login-content'),
                            place: 'prepend',
                            type: 'success',
                            message: "The password is changed successfully. <br> You are going to redirecting to login page ...",
                            close: true,
                            reset: true,
                            focus: true,
                            closeInSeconds: 5,
                            icon: 'fa fa-check'
                        });
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }


                } ]
            }, function( err, results ) {
                if( results.errorHandling ) {
                    $timeout(function() {
                        $state.go("vendorUrlNameBackend.signin", {}, { reload: true });
                    }, 5000);
                }
                if( err ) {
                    App.alert({
                        container: $('.login-content'),
                        place: 'prepend',
                        type: 'danger',
                        message: util.parseErrorMessage(err),
                        close: true,
                        reset: true,
                        focus: true,
                        closeInSeconds: 5,
                        icon: 'fa fa-warning'
                    });
                }

                loader.hide(".viewLoading");
            });
        };

    } ]);

