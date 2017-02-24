myApp.controllerProvider.register('UserAddCtrl', 
    function( 
        $scope,
        userService,
        $q,
        Upload,
        settings,
        $state,
        $localStorage,
        loader) {


        /**
         * check isLogin
         * @type {db}
         */
        userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");

        $scope.addUserObj = {
            billingAddress : {},
            setting : {
                defaults : {
                    'language' : 'en'
                }
            }
        };
        $scope.addUserObj.isActive = true;
        $scope.addUserObj.isBanned = false;
        $scope.addUserObj.isAdmin = false;

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

        $scope.emptyConfirmpass = function () {
            $scope.confirmPassword = "";
        };

        $scope.confirmPass = function (confirmPasswordValue) {
            var constraints = {
                confirmPassword: {
                    equality: "password"
                }
            };
            return !validate({
                password: $scope.addUserObj.password, confirmPassword: confirmPasswordValue
            }, constraints);
        };

        $scope.isEmail = function (emailValue) {
            var constraints = {
                from: {
                    email: true
                }
            };
            return !validate({from: emailValue}, constraints);
        };

        $scope.emailExist = function (emailValue) {
            var option = {
                scope: "backend",
                data: {
                    email: emailValue
                }
            };
            var defer = $q.defer();
            userService.existEmail(option).then(function (result) {
                if (!result.result || (result.data && !result.data.length)) {
                    defer.resolve();
                } else {
                    defer.reject();
                }

            }).catch(function (error) {
                defer.reject();
            });
            return defer.promise;
        };

        $scope.userNameExist = function (userNameValue) {
            var option = {
                scope : "backend",
                data : {
                    username : userNameValue
                }
            };
            var defer = $q.defer();
            userService.existUserName(option).then(function( result ) {
                console.log(result);
                if( !result.result || (result.data && !result.data.length) ) {
                    defer.resolve();
                } else {
                    defer.reject();
                }

            }).catch(function( error ) {
                defer.reject();
            });
            return defer.promise;
        };


        /**
         * add user function
         */
        $scope.addUser = function (file) {
            async.auto({
                startLoading: function (callback) {
                    loader.show(".viewLoading");
                    callback(null, true);
                },
                uploadFormData: function (callback) {

                    var option = {
                        scope: "backend",
                        data: {
                            user : $scope.addUserObj
                        }
                    };

                    console.log("add new user option : ", option);
                    userService.createUser(option).then(function (result) {
                        console.log("add user result :: ", result);
                        callback(null, result);
                    }).catch(function (error) {
                        console.log("add user error :: ", error);
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
                                url: settings.path.pathAppUploadAvatar + 'action/upload_avatar',
                                "userId" : result.uploadFormData.data.id,
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
                                    "userId" : result.uploadFormData.data.id,
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
                // if (!err && results.uploadFormData.result && results.uploadFile.error) {
                //     toastr.error("File upload failed.", "", {timeOut: $scope.delayMessageUpdateProduct});
                // }
                // else if (!err && results.uploadFormData.result && results.uploadFile.data && !results.uploadFile.error) {
                //     // toastr.success("User added successfully.", "", {timeOut: $scope.delayMessageUpdateProduct});
                //     // $window.history.back();
                    $state.go("root.userList");
                // } else {
                //     if (err) {
                //         toastr.error(err.data, "", {timeOut: $scope.delayMessageUpdateProduct});
                //     } else {
                //         $scope.fAvatar.progress = 0;
                //         $scope.userAvatar = null;
                //         $scope.$apply();
                //         if (typeof (results.uploadFile) != "string") {
                //             toastr.error(results.uploadFile.error.message, "", {timeOut: $scope.delayMessageUpdateProduct});
                //         } else {
                //             toastr.error(results.uploadFile, "", {timeOut: $scope.delayMessageUpdateProduct});
                //         }
                //     }
                // }
            });

        }
    });