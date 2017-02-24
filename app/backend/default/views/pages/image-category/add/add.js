myApp.controllerProvider.register('ImageCategoryAddCtrl', 
    function( 
        $scope,
        userService,
        Upload,
        settings,
        $state,
        $q,
        $localStorage,
        imageCategoryService,
        loader) {


        /**
         * check isLogin
         * @type {db}
         */
        userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");
        
        $scope.isActive = true;
        $scope.contentTypes = ['Photo', 'Vector', 'Illustration', 'Icon'];
        $scope.contentType = "Photo";
        
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
                if (!result.result || (result.data && !result.data.id)) {
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
         * add new category
         */
        $scope.addFunction = function (file) {
            console.log("file :: ", file);

            async.auto({
                startLoading : function (callback) {
                    loader.show(".viewLoading");
                    callback(null, true);
                },
                addData: function (callback, result) {

                    var option = {
                        scope : "backend",
                        token : $scope.token,
                        data : {
                            title : $scope.title,
                            description : $scope.description,
                            contentType : $scope.contentType,
                            isActive : $scope.isActive
                        }
                    };
                    console.log("create category option :: ", option);

                    imageCategoryService.createImageCategory(option).then(function (resp) {
                        console.log("create category resp : ", resp);
                        if(!resp.result || resp.status){
                            callback(resp.description || resp);
                        } else {
                            callback(null, resp);
                        }
                        callback(null, resp);
                    }).catch(function (error) {
                        console.log("create category error : ", error);
                        callback(error);
                    })
                },
                uploadFile: ['addData', function (callback, result) {
                    if (!result.addData.result) {
                        callback(result.addData);
                    } else {
                        if ($scope.file) {
                            $scope.f = file;
                            toastr.info("Uploading file ...", "", {timeOut: $scope.delayMessageUpdateProduct});
                            file.upload = Upload.upload({
                                url: settings.path.pathAppApi + '/imageCategory/action/upload_cover',
                                data: {
                                    "userId": $scope.userId,
                                    "id": result.addData.data.id,
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