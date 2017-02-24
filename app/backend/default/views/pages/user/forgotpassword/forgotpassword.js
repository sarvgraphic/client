myApp.controllerProvider.register('ForgotPasswordCtrl', [ '$scope', 'settings', '$rootScope', '$localStorage', '$state', 'userService', 'loader','$timeout', function( $scope, settings, $rootScope, $localStorage, $state, userService, loader, $timeout ) {

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


        $scope.sendEmailSubmit = function() {
            $scope.sendEmail();
        };

        /* validations */
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

        // ************************************
        // ******* forgot password ************
        // ************************************

        $scope.emailAvailable = false;
        $scope.sendEmail = function() {

            async.auto({
                startLoading: function( callback ) {
                    loader.show(".viewLoading");
                    $scope.vendorUrl = $localStorage[ $localStorage.appCurrentPath ].vendorObj.nameUrl || null;
                    callback(null, $scope.vendorUrl);
                }, sendEmailFun: [ 'startLoading', function( callback, result ) {

                    var option = {
                        config: {}, params: {
                            email: $scope.forgotPassEmail, entityUrl: result.startLoading, entityType: "vendor"
                        }
                    };

                    userService.forgotPassword(option).then(function( userLoginData ) {
                        callback(null, userLoginData);
                    }).catch(function( error ) {
                        callback(error);
                    });

                } ], update: [ 'sendEmailFun', function( callback, result ) {
                    if( result.sendEmailFun.result ) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }


                } ]
            }, function( err, results ) {
                if( results.update ) {
                    // App.alert({
                    //     container: $('.viewLoading'),
                    //     place: 'prepend',
                    //     type: 'success',
                    //     message: settings.forgotPasswordSuccess,
                    //     close: true,
                    //     reset: true,
                    //     focus: true,
                    //     closeInSeconds: 5,
                    //     icon: 'fa fa-check'
                    // });
                    toastr.success(settings.forgotPasswordSuccess, "", {timeOut: $scope.delayMessageUpdateProduct});
                    $scope.forgotPassEmail = "";
                } else {

                    // App.alert({
                    //     container: $('.viewLoading'),
                    //     place: 'prepend',
                    //     type: 'danger',
                    //     message: results.sendEmailFun.error,
                    //     close: true,
                    //     reset: true,
                    //     focus: true,
                    //     closeInSeconds: 5,
                    //     icon: 'fa fa-warning'
                    // });
                    toastr.error(results.sendEmailFun.error, "", {timeOut: $scope.delayMessageUpdateProduct});
                }

                $scope.$apply();
                loader.hide(".viewLoading");
            });
        };
        // ************************************
        // ******* /forgot password ***********
        // ************************************

    } ]);

