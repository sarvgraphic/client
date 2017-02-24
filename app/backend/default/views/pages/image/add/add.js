myApp.controllerProvider.register('ImageAddCtrl',
    function(
        $scope,
        userService,
        Upload,
        settings,
        $state,
        $timeout,
        $q,
        $localStorage,
        imageCategoryService,
        publisherService,
        imageTagService,
        imageService,
        loader) {


        /**
         * check isLogin
         * @type {db}
         */
        userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");

        $scope.isActive = true;
        $scope.directions = ['Vertical', 'Horizontal'];
        $scope.safeModes = ['Safe', '+12', '+16', '+18'];
        $scope.imageTypes = ['Photo', 'Vector', 'Illustration', 'Icon'];

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
            imageService.getOneImage(option).then(function (result) {
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
         * get all category
         */
        async.auto({
            getCategory : function (callback) {
                var option = {
                    scope : "backend",
                    token : $scope.token,
                    data : {
                        skip: 0,
                        limit: settings.findWhereLimit,
                        isActive : true
                    }
                };

                console.log("option :: ", option);

                imageCategoryService.getAllImageCategory(option).then(function (resp) {
                    console.log("resp :: ", resp);
                    callback(null, resp);
                }).catch(function (err) {
                    console.log("err :: ", err);
                    callback(err);
                })
            }
        }, function (error, results) {
            if(error){
                toastr.error("error in getting category", "", {timeout : settings.delayToastrTime});
            } else {
                if(results.getCategory.result){
                    $scope.categories = results.getCategory.data;
                } else {
                    toastr.error("error in getting category", "", {timeout : settings.delayToastrTime});
                }
            }
        });


        /**
         * get all publishers
         */
        async.auto({
            getPublishers : function (callback) {
                var option = {
                    scope : "backend",
                    token : $scope.token,
                    data : {
                        skip: 0,
                        limit: settings.findWhereLimit,
                        isActive : true,
                        isPending : false,
                        isExpired : false
                    }
                };

                console.log("publisher option :: ", option);

                publisherService.getAllPublisher(option).then(function (resp) {
                    console.log("publisher resp :: ", resp);
                    callback(null, resp);
                }).catch(function (err) {
                    console.log("publisher err :: ", err);
                    callback(err);
                })
            }
        }, function (error, results) {
            if(error){
                toastr.error("error in getting publisher", "", {timeout : settings.delayToastrTime});
            } else {
                if(results.getPublishers.result){
                    $scope.publishers = results.getPublishers.data;
                } else {
                    toastr.error("error in getting category", "", {timeout : settings.delayToastrTime});
                }
            }
        });


        /**
         * get all tags
         */
        $scope.getTags = function () {
            $timeout(function(){
                $('#tag-multi-id').multiSelect({
                    afterSelect: function( values ) {
                        if(values != null){
                            $scope.selectMultiTag = _.concat($scope.selectMultiTag, values);
                            $scope.selectMultiTag = _.uniq($scope.selectMultiTag);
                            if(!$scope.$$phase){
                                $scope.$apply();
                            }
                            // $scope.newSelectMultiPrdGroup = _.cloneDeep($scope.selectMultiTag);
                        }
                    }, afterDeselect: function( values ) {
                        if(values != null){
                            $scope.selectMultiTag = _.difference($scope.selectMultiTag, values);
                            $scope.selectMultiTag = _.uniq($scope.selectMultiTag);
                            if(!$scope.$$phase){
                                $scope.$apply();
                            }
                        }
                    }
                });
                $scope.selectMultiTag = [];
                $('#tag-multi-id').multiSelect('deselect_all');
                $('#tag-multi-id').multiSelect('refresh');
            }, 10);

            async.auto({
                getData : function (callback) {
                    var option = {
                        scope : "backend",
                        token : $scope.userObject.token,
                        data : {
                            skip: 0,
                            limit: settings.findWhereLimit,
                            isActive : true
                        }
                    };
                    imageTagService.findTags(option).then(function (resp) {
                        console.log("tag resp :: ", resp);
                        callback(null, resp);
                    }).catch(function (err) {
                        console.log("tag err :: ", err);
                        callback(err);
                    })
                }
            }, function (errors, results) {
                if(errors){
                    toastr.error("Unknown error", '', { timeOut: settings.delayToastrTime });
                } else {
                    if(results.getData.result){
                        $scope.tags = results.getData.data.list;
                        // $scope.tags.map(function (item) {
                        //     return item.fullName = item.firstname + " " + item.lastname + " ( " + item.username + " )";
                        // });
                        $scope.cloneUsers = _.cloneDeep($scope.tags);
                        if(!$scope.tags.length){
                            toastr.info("No user available", '', { timeOut: settings.delayToastrTime });
                        }
                        if(!$scope.$$phase){
                            $scope.$apply();
                        }
                    } else {
                        if(results.getData.error && results.getData.error.message){
                            toastr.error(results.getData.error.message, '', { timeOut: settings.delayToastrTime });
                        } else {
                            toastr.error("Unknown error", '', { timeOut: settings.delayToastrTime });
                        }

                    }
                }
                $('#tag-multi-id').multiSelect('refresh');
            })

        };
        $scope.getTags();



        /**
         * search in multi select
         * @type {string}
         */
        $scope.searchTag = "";
        $scope.searchMultiSelect = function(compinentId, mode) {
            async.auto({
                search: function (cb) {
                    var filteredFinalArray = [];


                    var filterArray = [];
                    var searchInArray = "";
                    var searchLastNameInArray = "";
                    var searchTagNameInArray = "";
                    if(mode == 'tag'){
                        $scope.newSelectedMulti = _.cloneDeep($scope.selectMultiTag);
                        filterArray = $scope.cloneUsers;
                        $scope.searchModel = $scope.searchTag;
                        searchInArray = "title";
                    }

                    async.filter(filterArray, function(item, cb1) {
                        if(_.includes(item[searchInArray].toLowerCase(), $scope.searchModel.toLowerCase())) {
                            filteredFinalArray.push(item);
                        }
                        cb1(null, true);
                    }, function() {

                        if(mode == 'tag'){
                            $scope.tags = filteredFinalArray;
                        }
                        cb(null, true);
                    });
                },
                refresh: ['search', function(cb) {
                    $timeout(function () {
                        $("#" + compinentId).multiSelect("refresh");
                        cb(null, true);
                    }, 0);
                }],
                deselect: ['refresh', function (cb) {
                    $timeout(function () {
                        $("#" + compinentId).multiSelect("deselect_all");
                        cb(null, true);
                    }, 0);
                }],
                select: ['deselect', function(cb) {
                    $timeout(function () {
                        $("#" + compinentId).multiSelect("select", $scope.newSelectedMulti);
                        cb(null, true);
                    }, 0);
                }]
            }, function() {
                $("#search-" + compinentId).focus();
                App.init();
                $scope.$apply();
            });
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
                            imageType : $scope.imageType,
                            isActive : $scope.isActive,
                            direction : $scope.direction,
                            safeMode : $scope.safeMode,
                            imageCategoryOwner : $scope.category._id,
                            publisherOwner : $scope.publisher._id,
                            tags : $scope.selectMultiTag
                        }
                    };
                    console.log("create image option :: ", option);

                    imageService.createImage(option).then(function (resp) {
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
                                url: settings.path.pathAppApi + '/image/action/upload_image_file',
                                data: {
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
                    $state.go("root.imageList");
                }
            })
        };

    });