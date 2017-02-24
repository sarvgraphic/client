myApp.controllerProvider.register('UserListCtrl',
    function (
        $scope,
        userService,
        settings,
        $timeout,
        $localStorage,
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

            $scope.username = "";
            $scope.firstname = "";
            $scope.lastname = "";
            $scope.email = "";
            $scope.isActive = "";
            $scope.isAdmin = "";



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
                $scope.findUser();
            };

            $scope.setItemsPerPage = function (num) {
                $scope.itemsPerPage = num;
                $scope.currentPage = 1;
                $scope.findUser();
            };

            $scope.searchGroups = function () {
                $scope.currentPage = 1;
                $scope.findUser();
            };


            /**
             * find user functions for table
             */
            $scope.findUser = function () {
                async.auto({
                    startLoading : function (callback) {
                        loader.show(".viewLoading");
                        callback(null, true);
                    },
                    findUser : function (callback) {

                        var option = {
                            scope : "backend",
                            token : $scope.userObject.token,
                            entityKey : "backend",
                            data : {
                                skip: ($scope.currentPage - 1) * $scope.viewby,
                                limit: $scope.viewby
                            }
                        };

                        if ($scope.username != "") {
                            option.data.username = {'contains': $scope.username};
                        }
                        if ($scope.firstname != "") {
                            option.data.firstname = {'contains': $scope.firstname};
                        }
                        if ($scope.lastname != "") {
                            option.data.lastname = {'contains': $scope.lastname};
                        }
                        if ($scope.email != "") {
                            option.data.email = {'contains': $scope.email};
                        }
                        if ($scope.isActive != "") {
                            option.data.isActive = $scope.isActive == 'true';
                        }
                        if ($scope.isAdmin != "") {
                            option.data.isAdmin = $scope.isAdmin == 'true';
                        }

                        console.log("find user option :: ", option);

                        userService.findUser(option).then(function (resp) {
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
                        $scope.showTable = true;
                        $scope.users = results.findUser.data;
                        $scope.totalItems = results.findUser.metadata.count;
                        $scope.$apply();
                        $timeout(function () {
                            App.init();
                        }, 100);

                    }
                })
            };
            $scope.findUser();



            /**
             * select one user for delete function
             */
            $scope.selectOneUser = function (userId, index) {
                $scope.selectedUserId = userId;
                $scope.selectedRowIndex = index;
            };


            /**
             * delete one user
             */
            $scope.deleteUser = function () {
                async.auto({
                    startLoading : function (callback) {
                        loader.show(".viewLoading");
                        callback(null, true);
                    },
                    deleteUser : function (callback) {

                        var option = {
                            scope : "backend",
                            data : {
                                id : $scope.selectedUserId
                            }
                        };

                        console.log("option : ", option);

                        userService.deleteUser(option).then(function (resp) {
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
                    } else if (!results.deleteUser.result){
                        toastr.error(results.deleteUser.message || 'Unknown error', '', { timeOut: settings.delayToastrTime });
                    } else {
                        if($scope.selectedRowIndex != null && results.deleteUser.result){
                            if($scope.users.length > 1){
                                $scope.users.splice($scope.selectedRowIndex, 1);
                            }else{
                                $scope.findUser();
                            }
                        }
                        $scope.selectedRowIndex = null;
                        $('#delete-modal-id').modal("hide");
                        $scope.$apply();
                    }
                })
            };
            

        

    }
);