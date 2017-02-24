myApp.controllerProvider.register('EditProfileCtrl', function( $scope, $window, $stateParams, $timeout, userService, $rootScope, settings, $state, $localStorage, backendConfig, Upload, $q, loader, $compile ) {

    /**
     * check isLogin
     * @type {db}
     */
    userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");

    $scope.localStorageAddress = $localStorage[ $localStorage.sscCurrentPath ];
    if(!$scope.userObject){
        $scope.userObject = $scope.localStorageAddress.userObject;
    }


    $scope.pathUserAvatar = settings.path.pathUserAvatar;
    $scope.userId = $stateParams.userId;

    if($scope.userId != $scope.userObject.id){
        $window.history.back();
    }

    /* validations */
    $scope.isRequired = function( val ) {
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
        $scope.passwordsObj.newConfirm = "";
    };

    $scope.confirmPass = function( confirmPasswordValue ) {
        var constraints = {
            confirmPassword: {
                equality: "password"
            }
        };
        return !validate({
            password: $scope.passwordsObj.newPass, confirmPassword: confirmPasswordValue
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

    $scope.emailExist = function( emailValue, id ) {
        var option = {
            scope : "backend",
            data : {
                email : emailValue
            }
        };
        var defer = $q.defer();
        userService.findOneUser(option).then(function( result ) {
            if( !result.data.id ) {
                defer.resolve();
            } else {
                if( result.data.id == id ) {
                    defer.resolve();
                } else {
                    defer.reject();
                }
            }

        }).catch(function( error ) {
            defer.reject();
        });
        return defer.promise;
    };

    $scope.userNameExist = function (userNameValue, id) {
        var option = {
            scope : "backend",
            data : {
                username : userNameValue
            }
        };
        var defer = $q.defer();
        userService.findOneUser(option).then(function( result ) {
            console.log(result);
            if( !result.data.id ) {
                defer.resolve();
            } else {
                if( result.data.id == id ) {
                    defer.resolve();
                } else {
                    defer.reject();
                }
            }

        }).catch(function( error ) {
            defer.reject();
        });
        return defer.promise;
    };




    async.auto({
        startLoading: function( callback ) {
            loader.show(".viewLoading");
            callback(null, true);
        }, setData: [ 'startLoading', function( callback, result ) {

            var option = {
                scope : "backend",
                data : {
                    id : $scope.userId
                }
            };

            console.log("option : ", option);

            userService.findOneUser(option).then(function (resp) {
                console.log("resp :: ", resp);
                callback(null, resp);
            }).catch(function (err) {
                console.log("err :: ", err);
                callback(err);
            });

            // callback(null, $scope.localStorageAddress.userObject);
        } ], updateView: [ 'setData', function( callback, result ) {
            $scope.userDetailProfile = _.clone(result.setData.data, true);
            callback(null, true);
        } ]
    }, function( err, results ) {
        if(!$scope.$$phase){
            $scope.$apply();
        }
        loader.hide(".viewLoading");
    });





    // *************************************
    // *** update user personal info *******
    // *************************************
    $scope.savePersonalInfo = function() {
        async.auto({
            startLoading: function( callback ) {
                loader.show(".viewLoading");
                callback(null, true);
            }, updateUserInfo: [ 'startLoading', function( callback, result ) {
                var option = {
                    scope : "backend",
                    data: {
                        userId : $scope.userDetailProfile.id,
                        user : {
                            firstname: $scope.userDetailProfile.firstname,
                            lastname: $scope.userDetailProfile.lastname,
                            username: $scope.userDetailProfile.username,
                            email: $scope.userDetailProfile.email
                        }
                    }
                };
                userService.updateOneUser(option).then(function( data ) {
                    callback(null, data);
                }).catch(function( error ) {
                    callback(error);
                });
            } ], updateInfoStorage: [ 'updateUserInfo', function( callback, result ) {
                if( result.updateUserInfo ) {
                    $scope.localStorageAddress.userObject.firstname = $scope.userDetailProfile.firstname;
                    $scope.localStorageAddress.userObject.lastname = $scope.userDetailProfile.lastname;
                    $scope.localStorageAddress.userObject.username = $scope.userDetailProfile.username;
                    $scope.localStorageAddress.userObject.email = $scope.userDetailProfile.email;
                    // $scope.localStorageAddress.userObject.userType = $scope.userDetailProfile.userType;
                }

                callback(null, true);
            } ]
        }, function( err, results ) {
            loader.hide(".viewLoading");
            $window.history.back();
        });
    };
    // *************************************
    // *** /update user personal info ******
    // *************************************

    // *************************************
    // *** update user address *************
    // *************************************
    $scope.saveAddress = function() {
        async.auto({
            startLoading: function( callback ) {
                loader.show(".viewLoading");
                callback(null, true);
            }, updateAddress: [ 'startLoading', function( callback ) {
                var option = {
                    scope : "backend",
                    data: {
                        userId : $scope.userDetailProfile.id,
                        user : {
                            billingAddress : $scope.userDetailProfile.billingAddress
                        }
                    }
                };
                console.log("address option :: ", option);
                userService.updateOneUser(option).then(function( data ) {
                    console.log("data :: ", data);
                    callback(null, data);
                }).catch(function( error ) {
                    console.log("data :: ", error);
                    callback(error);
                });
            } ], updateAddressStorage: [ 'updateAddress', function( callback, result ) {
                if( result.updateAddress) {
                    $scope.localStorageAddress.userObject.billingAddress = $scope.userDetailProfile.billingAddress;
                }

                callback(null, true);
            } ]
        }, function( err, results ) {
            loader.hide(".viewLoading");
            $window.history.back();
        });
    };
    // *************************************
    // *** /update user address ************
    // *************************************

    // *************************************
    // *** update user phones **************
    // *************************************
    $scope.savephones = function() {
        async.auto({
            startLoading: function( callback ) {
                loader.show(".viewLoading");
                callback(null, true);
            }, updatePhone: [ 'startLoading', function( callback ) {
                var option = {
                    scope : "backend",
                    data: {
                        userId : $scope.userDetailProfile.id,
                        user : {
                            phone : $scope.userDetailProfile.phone
                        }
                    }
                };
                console.log("phone option :: ", option);
                userService.updateOneUser(option).then(function( data ) {
                    console.log("data :: ", data);
                    callback(null, data);
                }).catch(function( error ) {
                    console.log("data :: ", error);
                    callback(error);
                });
            } ], updatePhoneStorage: [ 'updatePhone', function( callback, result ) {
                if( result.updatePhone ) {
                    $scope.localStorageAddress.userObject.phone = $scope.userDetailProfile.phone;
                }

                callback(null, true);
            } ]
        }, function( err, results ) {
            loader.hide(".viewLoading");
            $window.history.back();
        });
    };
    // *************************************
    // *** /update user phones *************
    // *************************************




    // *************************************
    // *** update user password ************
    // *************************************
    $scope.passwordsObj = {};
    $scope.changePassword = function() {
        async.auto({
            startLoading: function( callback ) {
                loader.show(".viewLoading");
                callback(null, true);
            }, updatePass: [ 'startLoading', function( callback ) {
                var option = {
                    scope : "backend",
                    data: {
                        userId: $scope.userId,
                        oldPassword: $scope.passwordsObj.current,
                        newPassword: $scope.passwordsObj.newPass
                    }
                };
                console.log("option :: ", option)
                userService.changePassword(option).then(function( data ) {
                    console.log("data :: ", data);
                    callback(null, data);
                }).catch(function( error ) {
                    console.log("error :: ", error);
                    callback(error);
                });
            } ]
        }, function( err, results ) {
            loader.hide(".viewLoading");
            if( results.updatePass.result ) {
                toastr.success("Password changes successfully", "", {timeOut: $scope.delayMessageUpdateProduct});
                $window.history.back();
            } else {
                toastr.error(results.updatePass.message || "Password is not changed", "", {timeOut: $scope.delayMessageUpdateProduct});
            }

        });
    };
    // *************************************
    // *** /update user password ***********
    // *************************************

} );