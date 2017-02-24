myApp.controllerProvider.register('ImageTagListCtrl', function ($scope, userService, settings, $timeout, $localStorage, loader, imageTagService) {

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
    $scope.deleteBulkBoxContent = settings.deleteBulkBoxContent;
    $scope.deleteBulkBoxTitle = settings.deleteBulkBoxTitle;
    $scope.deleteBulkBoxYesBtn = settings.deleteBulkBoxYesBtn;
    $scope.deleteBulkBoxNoBtn = settings.deleteBulkBoxNoBtn;
    $scope.statusBtnDeleteAll = true;
    $scope.dataNull = undefined;

    $scope.content = "";
    $scope.icon = "price.png";
    $scope.background = "";
    $scope.link = "root.imageTagAdd";
    $scope.button = "add new image tag";
    $scope.dataNull = undefined;

    $scope.checkRow = function() {
        if( _.filter($scope.listOfData, { "checked": true }).length == 0 ) {
            $scope.statusBtnDeleteAll = true;
            $scope.selectedAll = false;
            $timeout(function() {
                $.uniform.update();
            }, false, 0);
        } else {
            $scope.statusBtnDeleteAll = false;
        }
    };

    $scope.clickBtnDeleteAll = function() {
        if( (_.filter($scope.listOfData, "checked", true).length) > 1 ) {
            $scope.showMsgBulkOrSingleDelete = "bulk";
        } else {
            $scope.showMsgBulkOrSingleDelete = "single";
        }

    };

    $scope.checkAll = function() {
        if( $scope.selectedAll ) {
            $scope.statusBtnDeleteAll = false;
        } else {
            $scope.statusBtnDeleteAll = true;
        }
        async.auto({
            startLoading: function( cb ) {
                cb(null, true);
            },
            checkedItems: [ 'startLoading', function( cb ) {
                async.each($scope.listOfData, function( item, cb1 ) {
                    item.checked = $scope.selectedAll;
                    cb1(null, true);
                }, function() {
                    cb(null, true);
                });
            } ]
        }, function() {
            $.uniform.update();
            $scope.$apply();
            App.init();
        });
    };

    $scope.deleteItem = function( id ) {
        $scope.showMsgBulkOrSingleDelete = "single";
        async.auto({
            startLoading: function( cb ) {
                cb(null, true);
            }, checkedItems: [ 'startLoading', function( cb ) {
                async.each($scope.listOfData, function( item, cb1 ) {
                    if( item._id == id ) {
                        item.checked = true;
                    } else {
                        item.checked = false;
                    }
                    cb1();
                }, function() {
                    cb(null, true);
                });
            } ]
        }, function() {
            $.uniform.update();
            $scope.$apply();
            App.init();
        });
    };

    $scope.deleteMultiSelected = function() {
        $scope.checkboxSelectedArray = [];
        angular.forEach($scope.listOfData, function( item ) {
            if( item.checked == true ) {
                $scope.checkboxSelectedArray.push(item._id);
            }
        });
        $scope.deleteRow($scope.checkboxSelectedArray);
    };

    $scope.deleteRow = function( arrayID ) {
        if( arrayID.length == 1 ) {
            $scope.destroyItem(arrayID[ 0 ]);
        } else {
            $scope.bulk_delete();
        }

    };

    $scope.bulk_delete = function() {};

    $scope.destroyItem = function( itemID ) {
        async.auto({
            startLoading: function( cb ) {
                loader.show(".portlet");
                var index = _.findIndex($scope.listOfData, function(o) {
                    return o.id == itemID;
                });
                if(index != -1){
                    cb(null, $scope.listOfData[index].imgCover);
                } else {
                    cb(null, false);
                }
            },
            destroy: [ 'startLoading', function( cb, result ) {
                var option = {
                    scope : "backend",
                    token : $scope.userObject.token,
                    entityKey : "backend",
                    data : {
                        id: itemID
                    }
                };
                console.log("option", option);
                imageTagService.destroy(option).then(function(resp) {
                    console.log("resp", resp);
                    if(resp.result === false) {
                        toastr.error(resp.message, 'Image Tag', { timeOut: 5000 });
                    }
                    cb(null, true);
                }).catch(function(err) {
                    cb(err);
                });
            } ]
        }, function( error, results ) {
            $scope.getListFn();
            $scope.statusBtnDeleteAll = true;
            $('#delete-modal-id').modal("hide");
            $scope.$apply();
            App.init();
            loader.hide(".portlet");
        });
    };

    $scope.records = [
        { 'num': '5', 'value': 5 },
        { 'num': '10', 'value': 10 },
        {'num': '15', 'value': 15},
        { 'num': '20', 'value': 20 }
    ];
    $scope.viewby = 10;
    $scope.currentPage = 1;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 5; //Number of pager buttons to show

    $scope.setPage = function( pageNo ) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $scope.getListFn();
    };

    $scope.setItemsPerPage = function( num ) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        $scope.getListFn();
    };

    $scope.search = function() {
        $scope.currentPage = 1;
        $scope.getListFn();
    };

    function isInFilteringMode( data ) {
        if( data.title || data.countOfClicks || data.isActive) {
            return true;
        } else {
            return false;
        }
    }

    $scope.getListFn = function() {
        async.auto({
            startLoading: function( cb ) {
                loader.show(".portlet");
                cb(null, true);
            },
            getList: [ 'startLoading', function( cb ) {
                var option = {
                    scope : "backend",
                    token : $scope.userObject.token,
                    entityKey : "backend",
                    data : {
                        skip: ($scope.currentPage - 1) * $scope.viewby,
                        limit: $scope.viewby
                    }
                };

                if($scope.title && $scope.title !== null && $scope.title !== undefined) {
                    option.data.title = {'contains': $scope.title}
                }

                if($scope.countOfClicks && $scope.countOfClicks !== null && $scope.countOfClicks !== undefined) {
                    option.data.countOfClicks = $scope.countOfClicks
                }

                if($scope.isActive && $scope.isActive !== null && $scope.isActive !== undefined) {
                    option.data.isActive = $scope.isActive.toString() === 'true'
                }
                $scope.isFiltering = isInFilteringMode(option.data);
                imageTagService.findTags(option).then(function( resp ) {
                    if(resp.result) {
                        $scope.listOfData = resp.data.list;
                        $scope.totalItems = resp.data.total;
                        $scope.showTable = false;
                        $scope.changeFilterShow = false;

                        if( _.size(resp.data.list) == 0 && !$scope.isFiltering ) {
                            $scope.dataNull = false;
                            $scope.content = "No image tag has been defined yet. Click here to create the first image tag.";
                            $scope.button = "add new image tag";
                        } else if( _.size(resp.data.list) == 0 && $scope.isFiltering ) {
                            $scope.content = "No results matched your search. Please try again with different criteria.";
                            $scope.button = "";
                            $scope.changeFilterShow = true;
                            $scope.dataNull = true;
                            $scope.showTable = false;
                        } else {
                            $scope.dataNull = true;
                            $scope.showTable = true;
                        }
                    } else {
                        $scope.dataNull = true;
                    }
                    cb(null, resp);
                }).catch(function( error ) {
                    cb(null, error);
                });
            }]
        }, function() {
            $scope.$apply();
            App.init();
            loader.hide('.portlet');
        });
    };
    $scope.getListFn();

});