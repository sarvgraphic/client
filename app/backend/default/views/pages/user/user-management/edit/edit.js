myApp.controllerProvider.register('UserEditCtrl',
    function(
        $scope,
        userService,
        $q,
        settings,
        Upload,
        $stateParams,
        $localStorage,
        $state,
        loader) {

        /**
         * check isLogin
         * @type {db}
         */
        userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");


        $scope.editUserObj = {};
        $scope.editUserObj.isActive = true;
        $scope.editUserObj.isBanned = false;
        $scope.editUserObj.isAdmin = false;

        $scope.passwordObj = {
            password : ""
        };

        /**
         * validation functions
         */
        $scope.isRequired = function (val) {
            return !validate.isEmpty(val);
        };

        $scope.hasMinLength = function (val) {
            var constraints = {
                from: {
                    length: {
                        minimum: 8
                    }
                }
            };
            return !validate({from: val}, constraints);
        };

        // $scope.emptyConfirmpass = function () {
        //     $scope.confirmPassword = "";
        // };

        // $scope.confirmPass = function (confirmPasswordValue) {
        //     var constraints = {
        //         confirmPassword: {
        //             equality: "password"
        //         }
        //     };
        //     return !validate({
        //         password: $scope.editUserObj.password, confirmPassword: confirmPasswordValue
        //     }, constraints);
        // };

        $scope.isEmail = function (emailValue) {
            var constraints = {
                from: {
                    email: true
                }
            };
            return !validate({from: emailValue}, constraints);
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
                console.log("result :; ", result)
                console.log("result.data.id :; ", result.data.id)
                console.log("id :; ", id)
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


        /**
         * find selected user
         */
        async.auto({
            startLoading : function (callback) {
                loader.show(".viewLoading");
                callback(null, true);
            },
            findUser : function (callback) {

                var option = {
                    scope : "backend",
                    data : {
                        id : $stateParams.userId
                    }
                };

                console.log("option : ", option);

                userService.findOneUser(option).then(function (resp) {
                    console.log("resp :: ", resp);
                    callback(null, resp);
                }).catch(function (err) {
                    console.log("err :: ", err);
                    callback(err);
                })
            }
        }, function (errors, results) {
            loader.hide(".viewLoading");
            if(errors){
                toastr.error('Unknown error', '', { timeOut: settings.delayToastrTime });
            } else if (!results.findUser.result){
                toastr.error(results.findUser.message, '', { timeOut: settings.delayToastrTime });
            } else {
                $scope.editUserObj = results.findUser.data;
                console.log("$scope.editUserObj :: ", $scope.editUserObj)
                $scope.$apply();
            }
        });


        $scope.removeFile = false;

        /**
         * update user function
         */
        $scope.updateOneUser = function (file) {

            if (file) {
                $scope.removeFile = false;
            }

            async.auto({
                startLoading: function (callback) {
                    loader.show(".viewLoading");
                    callback(null, true);
                },
                uploadFormData: function (callback) {

                    delete $scope.editUserObj.id;
                    delete $scope.editUserObj.updatedAt;
                    delete $scope.editUserObj.createdAt;
                    // delete $scope.editUserObj.imgAvatar;

                    var option = {
                        scope: "backend",
                        data: {
                            userId : $stateParams.userId,
                            password: $scope.passwordObj.password,
                            user : $scope.editUserObj,
                            removeFile : $scope.removeFile
                        }
                    };

                    console.log("update new user option : ", option);
                    userService.updateOneUser(option).then(function (result) {
                        console.log("update user result :: ", result);
                        callback(null, result);
                    }).catch(function (error) {
                        console.log("update user error :: ", error);
                        callback(error);
                    });
                },
                uploadFile: ['uploadFormData', function (callback, result) {
                    console.log("result.uploadFormData=======",result.uploadFormData);
                    if (!result.uploadFormData.result) {
                        callback(result.uploadFormData);
                    } else {
                        if ($scope.userAvatar) {
                            var data= {
                                "userId" : $stateParams.userId,
                                "access_token" : $scope.tokenId,
                                "avatar" : file
                            };
                            console.log("data ----- : ",data);
                            $scope.fAvatar = file;
                            toastr.info("Uploading image ...", "", {timeOut: $scope.delayMessageUpdateProduct});
                            file.upload = Upload.upload({
                                method: "POST",
                                url: settings.path.pathAppUploadAvatar + 'action/upload_avatar',
                                data: {
                                    "userId" : $stateParams.userId,
                                    "access_token" : $scope.tokenId,
                                    "avatar" : file
                                }
                            });

                            file.upload.then(function (response) {
                                console.log("image response : ", response.data);
                                file.result = response.data;
                                if (!response.data.error && response.data.data) {
                                    // toastr.success("Image uploaded successfully.", "", {timeOut: $scope.delayMessageUpdateProduct});
                                    callback(null, response.data);
                                } else {
                                    if (response.data.error && response.data.error.message) {
                                        callback(null, response.data);
                                    } else {
                                        callback(null, "Unknown error");
                                    }
                                }
                            }, function (error) {
                                if (error.status > 0) {
                                    $scope.errorMsg = error.status + ': ' + error.data;
                                }
                                callback(error);
                            }, function (evt) {
                                // Math.min is to fix IE which reports 200% sometimes
                                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                            });
                        } else {
                            callback(null, result.uploadFormData);
                        }
                    }
                }]
            }, function (err, results) {
                loader.hide(".viewLoading");
                if (!err && results.uploadFormData.result && results.uploadFile.error) {
                    toastr.error("File upload failed.", "", {timeOut: $scope.delayMessageUpdateProduct});
                }
                else if (!err && results.uploadFormData.result && results.uploadFile.data && !results.uploadFile.error) {
                    // toastr.success("User added successfully.", "", {timeOut: $scope.delayMessageUpdateProduct});
                    // $window.history.back();
                    $state.go("root.userList");
                } else {
                    if (err) {
                        toastr.error(err.data, "", {timeOut: $scope.delayMessageUpdateProduct});
                    } else {
                        $scope.fAvatar.progress = 0;
                        $scope.userAvatar = null;
                        $scope.$apply();
                        if (typeof (results.uploadFile) != "string") {
                            toastr.error(results.uploadFile.error.message, "", {timeOut: $scope.delayMessageUpdateProduct});
                        } else {
                            toastr.error(results.uploadFile, "", {timeOut: $scope.delayMessageUpdateProduct});
                        }
                    }
                }
            });

        }
    });