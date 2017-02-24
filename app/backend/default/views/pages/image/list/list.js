myApp.controllerProvider.register('ImageListCtrl',
    function (
        $scope,
        userService,
        settings,
        $timeout,
        $localStorage,
        imageCategoryService,
        imageService,
        loader
    )
    {
        
        /**
         * check isLogin
         * @type {db}
         */
        userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");


        $scope.localStorageAddress = $localStorage[ $localStorage.sscCurrentPath ];
        
        if(!$scope.userObject){
            $scope.userObject = $scope.localStorageAddress.userObject;
        }

            /**
             * define variables
             */
            $scope.delayTypeTime = settings.delayTypeTime;
            $scope.deleteBoxTitle = settings.deleteBoxTitle;
            $scope.deleteBoxContent = settings.deleteBoxContent;
            $scope.deleteBoxYesBtn = settings.deleteBoxYesBtn;
            $scope.deleteBoxNoBtn = settings.deleteBoxNoBtn;
            $scope.path = settings.path.pathAppApi;
            $scope.date = new Date().getTime();
            $scope.records = [
                {'num': '5', 'value': 5},
                {'num': '10', 'value': 10},
                {'num': '15', 'value': 15},
                {'num': '20', 'value': 20},
                {'num': '40', 'value': 40}
            ];
            $scope.viewby = 10;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;

            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.pageChanged = function () {
                $scope.findData();
            };

            $scope.setItemsPerPage = function (num) {
                $scope.itemsPerPage = num;
                $scope.currentPage = 1;
                $scope.findData();
            };

            $scope.searchGroups = function () {
                $scope.currentPage = 1;
                $scope.findData();
            };


        $scope.title = "";
        $scope.direction = "";
        $scope.safeMode = "";
        $scope.category = "";
        $scope.publisher = "";
        $scope.imageType = "";
        $scope.isActive = "";
        $scope.countOfDownloadsFrom = "";
        $scope.countOfDownloadsTo = "";
        $scope.countOfClickFrom = "";
        $scope.countOfClickTo = "";
            /**
             * find user functions for table
             */
            $scope.findData = function () {
                async.auto({
                    startLoading : function (callback) {
                        loader.show(".viewLoading");
                        callback(null, true);
                    },
                    findData : function (callback) {

                        var option = {
                            scope : "backend",
                            token : $scope.token,
                            data : {
                                skip: ($scope.currentPage - 1) * $scope.viewby,
                                limit: $scope.viewby
                            }
                        };

                        if ($scope.title != "") {
                            option.data.title = {'contains': $scope.title};
                        }
                        if ($scope.category != "") {
                            option.data.category = {'contains': $scope.category};
                        }

                        if ($scope.publisher != "") {
                            option.data.publisher = {'contains': $scope.publisher};
                        }

                        if ($scope.direction != "") {
                            option.data.direction = $scope.direction;
                        }
                        if ($scope.safeMode != "") {
                            option.data.safeMode = $scope.safeMode;
                        }
                        if ($scope.imageType != "") {
                            option.data.imageType = $scope.imageType;
                        }
                        
                        if ($scope.countOfDownloadsFrom != "") {
                            option.data.countOfDownloadsFrom = $scope.countOfDownloadsFrom;
                        }
                        if ($scope.countOfDownloadsTo != "") {
                            option.data.countOfDownloadsTo = $scope.countOfDownloadsTo;
                        }
                        
                        if ($scope.countOfClickFrom != "") {
                            option.data.countOfClickFrom = $scope.countOfClickFrom;
                        }
                        if ($scope.countOfClickTo != "") {
                            option.data.countOfClickTo = $scope.countOfClickTo;
                        }
                        // if ($scope.email != "") {
                        //     option.data = {'contains': $scope.email};
                        // }
                        if ($scope.isActive != "") {
                            option.data.isActive = $scope.isActive == 'true';
                        }
                       

                        console.log("find user option :: ", option);

                        imageService.getAllImage(option).then(function (resp) {
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
                    } else if (!results.findData.result){
                        toastr.error(results.findData.message, '', { timeOut: settings.delayToastrTime });
                    } else {
                        $scope.showTable = true;
                        $scope.images = results.findData.data;
                        $scope.totalItems = results.findData.metadata.count;
                        $scope.$apply();
                        $timeout(function () {
                            App.init();
                        }, 100);

                    }
                })
            };
            $scope.findData();



            /**
             * select one user for delete function
             */
            $scope.selectOneImage = function (id, index) {
                $scope.selectedImageId = id;
                $scope.selectedRowIndex = index;
                console.log($scope.selectedRowIndex, "   ", $scope.selectedImageId);
            };


            /**
             * delete one user
             */
            $scope.deleteImage = function () {
                async.auto({
                    startLoading : function (callback) {
                        loader.show(".viewLoading");
                        callback(null, true);
                    },
                    deleteImage : function (callback) {

                        var option = {
                            scope : "backend",
                            data : {
                                id : $scope.selectedImageId
                            }
                        };

                        console.log("option : ", option);

                        imageService.destroyOneImage(option).then(function (resp) {
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
                    } else if (!results.deleteImage.result){
                        toastr.error(results.deleteImage.message || 'Unknown error', '', { timeOut: settings.delayToastrTime });
                    } else {
                        if(results.deleteImage.result){
                            $scope.findData();
                        }
                        $scope.selectedRowIndex = null;
                        $('#delete-modal-id').modal("hide");
                        $scope.$apply();
                    }
                })
            };
            

        

    }
);