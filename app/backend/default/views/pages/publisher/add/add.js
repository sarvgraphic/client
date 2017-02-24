myApp.controllerProvider.register('PublisherAddCtrl', 
    function( 
        $scope,
        userService,
        Upload,
        settings,
        $state,
        $q,
        $timeout,
        $localStorage,
        publisherService,
        loader) {


        /**
         * check isLogin
         * @type {db}
         */
        userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");
        
        $scope.isActive = true;
        $scope.isPending = false;
        $scope.isExpired = false;
        $scope.checkbox = {};
        $scope.typeOfPublication = [];

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
            publisherService.getOnePublisher(option).then(function (result) {
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
         * select publication type
         */
        $scope.selectType = function () {
            $scope.typeOfPublication = [];
            for(var i in $scope.checkbox){
                if($scope.checkbox[i] == true){
                    $scope.typeOfPublication.push(i);
                }
            }
            // console.log($scope.selectMultiUser )
        };


        /**
         * get all users
         */
        $scope.getUsers = function () {
            $timeout(function(){
                $('#user-multi-id').multiSelect({
                    afterSelect: function( values ) {
                        if(values != null){
                            $scope.selectMultiUser = _.concat($scope.selectMultiUser, values);
                            $scope.selectMultiUser = _.uniq($scope.selectMultiUser);
                            if(!$scope.$$phase){
                                $scope.$apply();
                            }
                            // $scope.newSelectMultiPrdGroup = _.cloneDeep($scope.selectMultiUser);
                        }
                    }, afterDeselect: function( values ) {
                        if(values != null){
                            $scope.selectMultiUser = _.difference($scope.selectMultiUser, values);
                            $scope.selectMultiUser = _.uniq($scope.selectMultiUser);
                            if(!$scope.$$phase){
                                $scope.$apply();
                            }
                        }
                    }
                });
                $scope.selectMultiUser = [];
                $('#user-multi-id').multiSelect('deselect_all');
                $('#user-multi-id').multiSelect('refresh');
            }, 10);

            async.auto({
                getData : function (callback) {
                    var option = {
                        scope : "backend",
                        token : $scope.userObject.token,
                        entityKey : "backend",
                        data : {
                            skip: ($scope.currentPage - 1) * $scope.viewby,
                            limit: $scope.viewby,
                            isActive : true
                        }
                    };
                    userService.findUser(option).then(function (resp) {
                        console.log("resp :: ", resp);
                        callback(null, resp);
                    }).catch(function (err) {
                        console.log("err :: ", err);
                        callback(err);
                    })
                }
            }, function (errors, results) {
                if(errors){
                    toastr.error("Unknown error", '', { timeOut: settings.delayToastrTime });
                } else {
                    if(results.getData.result){
                        $scope.users = results.getData.data;
                        $scope.users.map(function (item) {
                            return item.fullName = item.firstname + " " + item.lastname + " ( " + item.username + " )";
                        });
                        $scope.cloneUsers = _.cloneDeep($scope.users);
                        if(!$scope.users.length){
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
                $('#user-multi-id').multiSelect('refresh');
            })

        };
        $scope.getUsers();


        /**
         * search in multi select
         * @type {string}
         */
        $scope.searchUser = "";
        $scope.searchMultiSelect = function(compinentId, mode) {
            async.auto({
                search: function (cb) {
                    var filteredFinalArray = [];


                    var filterArray = [];
                    var searchFirstNameInArray = "";
                    var searchLastNameInArray = "";
                    var searchUserNameInArray = "";
                    if(mode == 'user'){
                        $scope.newSelectedMulti = _.cloneDeep($scope.selectMultiUser);
                        filterArray = $scope.cloneUsers;
                        $scope.searchModel = $scope.searchUser;
                        searchFirstNameInArray = "firstname";
                        searchLastNameInArray = "lastname";
                        searchUserNameInArray = "username";
                    }

                    async.filter(filterArray, function(item, cb1) {
                        if(_.includes(item[searchFirstNameInArray].toLowerCase(), $scope.searchModel.toLowerCase())) {
                            filteredFinalArray.push(item);
                        } else if(_.includes(item[searchLastNameInArray].toLowerCase(), $scope.searchModel.toLowerCase())) {
                            filteredFinalArray.push(item);
                        } else if(_.includes(item[searchUserNameInArray].toLowerCase(), $scope.searchModel.toLowerCase())) {
                            filteredFinalArray.push(item);
                        }
                        cb1(null, true);
                    }, function() {

                        if(mode == 'user'){
                            $scope.users = filteredFinalArray;
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
         * add new publisher
         */
        $scope.addFunction = function (avatar, cover) {
            console.log("avatar :: ", avatar);
            console.log("cover :: ", cover);

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
                            about : $scope.about,
                            typeOfPublication : $scope.typeOfPublication,
                            isActive : $scope.isActive,
                            isExpired : $scope.isExpired,
                            isPending : $scope.isPending,
                            users : $scope.selectMultiUser
                        }
                    };
                    console.log("create image option :: ", option);

                    publisherService.createPublisher(option).then(function (resp) {
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
                uploadAvatar: ['addData', function (callback, result) {
                    if (!result.addData.result) {
                        callback(result.addData);
                    } else {
                        if ($scope.avatar) {
                            $scope.fAvatar = avatar;
                            toastr.info("Uploading avatar ...", "", {timeOut: $scope.delayMessageUpdateProduct});
                            avatar.upload = Upload.upload({
                                url: settings.path.pathAppApi + '/publisher/action/upload_image_avatar',
                                data: {
                                    "id": result.addData.data.id,
                                    "image": avatar
                                }
                            });

                            avatar.upload.then(function (response) {
                                console.log("image response : ", response.data);
                                avatar.result = response.data;
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
                                avatar.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                            });
                        } else {
                            callback(null, result.addData);
                        }
                    }
                }],
                uploadCover: ['addData', function (callback, result) {
                    if (!result.addData.result) {
                        callback(result.addData);
                    } else {
                        if ($scope.cover) {
                            $scope.fCover = cover;
                            toastr.info("Uploading cover ...", "", {timeOut: $scope.delayMessageUpdateProduct});
                            cover.upload = Upload.upload({
                                url: settings.path.pathAppApi + '/publisher/action/upload_image_cover',
                                data: {
                                    "id": result.addData.data.id,
                                    "image": cover
                                }
                            });

                            cover.upload.then(function (response) {
                                console.log("image response : ", response.data);
                                cover.result = response.data;
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
                                cover.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
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
                    $state.go("root.publisherList");
                }
            })
        };
        
    });