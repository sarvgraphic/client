myApp.controllerProvider.register('PublisherListCtrl',
    function (
        $scope,
        userService,
        settings,
        $timeout,
        $localStorage,
        imageCategoryService,
        publisherService,
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
        $scope.isActive = "";
        $scope.countOfImageItemsFrom = "";
        $scope.countOfImageItemsTo = "";
        $scope.countOfImageActiveItemsFrom = "";
        $scope.countOfImageActiveItemsTo = "";
        $scope.countOfClicksFrom = "";
        $scope.countOfClicksTo = "";
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
                        
                        if ($scope.countOfImageItemsFrom != "") {
                            option.data.countOfImageItemsFrom = $scope.countOfImageItemsFrom;
                        }
                        if ($scope.countOfImageItemsTo != "") {
                            option.data.countOfImageItemsTo = $scope.countOfImageItemsTo;
                        }
                        
                        if ($scope.countOfImageActiveItemsFrom != "") {
                            option.data.countOfImageActiveItemsFrom = $scope.countOfImageActiveItemsFrom;
                        }
                        if ($scope.countOfImageActiveItemsTo != "") {
                            option.data.countOfImageActiveItemsTo = $scope.countOfImageActiveItemsTo;
                        }

                        if ($scope.countOfClicksFrom != "") {
                            option.data.countOfClicksFrom = $scope.countOfClicksFrom;
                        }
                        if ($scope.countOfClicksTo != "") {
                            option.data.countOfClicksTo = $scope.countOfClicksTo;
                        }
                        // if ($scope.email != "") {
                        //     option.data = {'contains': $scope.email};
                        // }
                        if ($scope.isActive != "") {
                            option.data.isActive = $scope.isActive == 'true';
                        }
                       

                        console.log("find user option :: ", option);

                        publisherService.getAllPublisher(option).then(function (resp) {
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
                        $scope.publishers = results.findData.data;
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
            $scope.selectOnePublisher = function (id, index) {
                $scope.selectedPublisherId = id;
                $scope.selectedRowIndex = index;
                console.log($scope.selectedRowIndex, "   ", $scope.selectedPublisherId);
            };


            /**
             * delete one user
             */
            $scope.deletePublisher = function () {
                async.auto({
                    startLoading : function (callback) {
                        loader.show(".viewLoading");
                        callback(null, true);
                    },
                    deletePublisher : function (callback) {

                        var option = {
                            scope : "backend",
                            data : {
                                id : $scope.selectedPublisherId
                            }
                        };

                        console.log("option : ", option);

                        publisherService.destroyOnePublisher(option).then(function (resp) {
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
                    } else if (!results.deletePublisher.result){
                        toastr.error(results.deletePublisher.message || 'Unknown error', '', { timeOut: settings.delayToastrTime });
                    } else {
                        if(results.deletePublisher.result){
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