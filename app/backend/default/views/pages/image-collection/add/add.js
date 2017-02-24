myApp.controllerProvider.register('ImageCollectionAddCtrl', function ($scope, userService, settings, $timeout, $localStorage, loader, imageCollectionService, $q, Upload, $state) {

    /**
     * check isLogin
     * @type {db}
     */
    userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");


    $scope.localStorageAddress = $localStorage[ $localStorage.sscCurrentPath ];

    if(!$scope.userObject){
        $scope.userObject = $scope.localStorageAddress.userObject;
    }

    $scope.delayTypeTime = settings.delayTypeTime;
    $scope.isActive = true;
    $scope.isTopFeatured = false;
    $scope.isFeatured = false;

    $scope.isRequired = function(val){
        return !validate.isEmpty(val);
    };
    
    $scope.contentTypes = ['Photo', 'Vector', 'Illustration', 'Icon'];

    $scope.exist = function(val, field) {
        var option = {
            scope : "backend",
            token : $scope.userObject.token,
            entityKey : "backend",
            data : {}
        };
        option.data[ field ] = val;
        var defer = $q.defer();
        imageCollectionService.exist(option).then(function(resp) {
            if(resp.result){
                if(resp.data == 'exist'){
                    defer.reject()
                } else {
                    defer.resolve();
                }
            } else {
                defer.reject();
            }
        }).catch(function() {
            defer.reject();
        });
        return defer.promise;
    };
    
    $scope.itemSave = function() {
        async.auto({
            startLoading: function(cb) {
                loader.show(".portlet-body");
                cb(null, true);
            },
            create: ['startLoading', function(cb, result) {
                var option = {
                    scope: 'backend',
                    token: $scope.userObject.token,
                    entityKey: 'backend',
                    data: {
                        title: $scope.title,
                        contentType: $scope.contentType,
                        description: $scope.description,
                        isActive: $scope.isActive,
                        isTopFeatured: $scope.isTopFeatured,
                        isFeatured: $scope.isFeatured
                    }
                };
                imageCollectionService.create(option).then(function(resp) {
                    if(resp.result) {
                        cb(null, resp);
                    } else {
                        cb(resp);
                    }
                }).catch(function(err) {
                    cb(err);
                });
            }],
            image: ['create', function(cb, result) {
                if($scope.imgCover) {
                    toastr.info("Uploading image ...", "", {timeOut: settings.delayToastrTime});
                    $scope.imgCover.upload = Upload.upload({
                        method: "POST",
                        url: settings.path.pathAppUploadImgCover + 'action/uploadImgCover',
                        data: {
                            "id" : result.create.data.id,
                            "access_token" : $scope.tokenId,
                            "imgCover" : $scope.imgCover
                        }
                    });
                    $scope.imgCover.upload.then(function (response) {
                        $scope.imgCover.result = response.data;
                        if(response.data.result === false) {
                            toastr.error("Uploading image ...", response.data.debug.parameter.error, {timeOut: settings.delayToastrTime});
                        }
                        cb(null, true);
                        // if (!response.data.error && response.data.data) {
                        //     // toastr.success("Image uploaded successfully.", "", {timeOut: $scope.delayMessageUpdateProduct});
                        //     callback(null, response.data);
                        // } else {
                        //     if (response.data.error && response.data.error.message) {
                        //         callback(null, response.data);
                        //     } else {
                        //         callback(null, "Unknown error");
                        //     }
                        // }
                    }, function (err) {
                        cb(err);
                        // console.log("error : ", error);

                        // if (error.status > 0) {
                        //     $scope.errorMsg = error.status + ': ' + error.data;
                        // }
                        // callback(error);
                    }, function (evt) {
                        // console.log('evt', evt);
                        // Math.min is to fix IE which reports 200% sometimes
                        $scope.imgCover.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                } else {
                    cb(null, true);
                }
            }]
        }, function(errors, results) {
            if(errors != null) {
                toastr.error("Image Collection", errors, {timeOut: settings.delayToastrTime});
            }
            loader.hide(".portlet-body");
            $state.go("root.imageCollectionList");
        });
    }

});