myApp.controllerProvider.register('ImageCategoryEditCtrl',
    function(
        $scope,
        userService,
        Upload,
        settings,
        $state,
        $stateParams,
        $q,
        $localStorage,
        imageCategoryService,
        loader) {


        /**
         * check isLogin
         * @type {db}
         */
        userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");

        $scope.id = $stateParams.id;
        $scope.contentTypes = ['Photo', 'Vector', 'Illustration', 'Icon'];

        /**
         * validation functions
         */
        $scope.isRequired = function (val) {
            return !validate.isEmpty(val);
        };

        $scope.titleExist = function (titleValue) {
            var option = {
                scope: "backend",
                data: {
                    title: titleValue
                }
            };
            var defer = $q.defer();
            imageCategoryService.getOneImageCategory(option).then(function (result) {
                if (!result.result || (result.data && !result.data.id) || result.data.id == $scope.id) {
                    defer.resolve();
                } else {
                    defer.reject();
                }

            }).catch(function (error) {
                defer.reject();
            });
            return defer.promise;
        };


        /**
         * get selected category
         */
        async.auto({
            startLoading : function (callback) {
                loader.show(".viewLoading");
                callback(null, true);
            },
            getData : function (callback) {
                var option = {
                    scope: "backend",
                    data: {
                        id: $scope.id
                    }
                };
                imageCategoryService.getOneImageCategory(option).then(function (resp) {
                    console.log("for edit category resp :: ", resp);
                    callback(null, resp);
                }).catch(function (err) {
                    console.log("for edit category error :: ", err);
                    callback(err);
                });
            }
        }, function (error, results) {
            loader.hide(".viewLoading");
            if(error){
                toastr.error("unknown error", "", { timeOut: settings.delayToastrTime });
            } else {
                if(results.getData.result){
                    $scope.resultObject = results.getData.data;
                } else {
                    toastr.error(results.getData.metadata.message || "unknown error", "", { timeOut: settings.delayToastrTime });
                }
            }
        });


        $scope.removeFile = false;

        /**
         * add new category
         */
        $scope.editFunction = function (file) {
            console.log("file :: ", file);

            if (file) {
                $scope.removeFile = false;
            }

            async.auto({
                startLoading : function (callback) {
                    loader.show(".viewLoading");
                    callback(null, true);
                },
                addData: function (callback, result) {

                    delete $scope.resultObject.id;
                    delete $scope.resultObject.updatedAt;
                    delete $scope.resultObject.createdAt;

                    var option = {
                        scope: "backend",
                        data: {
                            id : $scope.id,
                            category : $scope.resultObject,
                            removeFile : $scope.removeFile
                        }
                    };
                    console.log("update category option :: ", option);

                    imageCategoryService.editOneImageCategory(option).then(function (resp) {
                        console.log("update category resp : ", resp);
                        if(!resp.result || resp.status){
                            callback(resp.description || resp);
                        } else {
                            callback(null, resp);
                        }
                        callback(null, resp);
                    }).catch(function (error) {
                        console.log("update category error : ", error);
                        callback(error);
                    })
                },
                uploadFile: ['addData', function (callback, result) {
                    console.log({
                        "id": $scope.id,
                        "image": file
                    })
                    if (!result.addData.result) {
                        callback(result.addData);
                    } else {
                        if ($scope.file) {
                            $scope.f = file;
                            toastr.info("Uploading file ...", "", {timeOut: settings.delayToastrTime});
                            file.upload = Upload.upload({
                                url: settings.path.pathAppApi + '/imageCategory/action/upload_cover',
                                data: {
                                    "id": $scope.id,
                                    "image": file
                                }
                            });

                            file.upload.then(function (response) {
                                console.log("image response : ", response.data);
                                file.result = response.data;
                                if (!response.data.error && response.data.data) {
                                    // toastr.success("File uploaded successfully.", "", {timeOut: $scope.delayMessageUpdateProduct});
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
                            callback(null, result.addData);
                        }
                    }
                }]
            }, function (error, results) {
                loader.hide(".viewLoading");
                if(error){
                    if(typeof error == "string"){
                        toastr.error(error, "",  { timeOut: settings.delayToastrTime });
                    } else if(error.message){
                        toastr.error(error.message || "unknown error", "",  { timeOut: settings.delayToastrTime });
                    } else {
                        toastr.error("unknown error", "",  { timeOut: settings.delayToastrTime });
                    }
                } else {
                    $state.go("root.imageCategoryList");
                }
            })
        };

    });