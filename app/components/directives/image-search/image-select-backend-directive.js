myApp.compileProvider.directive("imageSelectBackendDirective", function() {
    return {
        restrict: "E",
        scope: {},
        templateUrl: '/app/components/directives/image-search/view/image-select-backend-template.html',
        controller: 'imageSelectBackendDirectiveController'
    };
});
myApp.controllerProvider.register("imageSelectBackendDirectiveController", function( $scope, imageService, userService, $localStorage, loader, settings, $timeout ) {
    /**
     * check isLogin
     * @type {db}
     */
    userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");
    $scope.localStorageAddress = $localStorage[ $localStorage.sscCurrentPath ];
    if(!$scope.userObject){
        $scope.userObject = $scope.localStorageAddress.userObject;
    }
    $scope.path = settings.path.pathAppApi;
    $scope.date = new Date().getTime();
    $scope.content = "";
    $scope.icon = "price.png";
    $scope.background = "";
    $scope.link = "root.imageAdd";
    $scope.button = "add new image";
    $scope.dataNull = true;
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
        if( data.title ) {
            return true;
        } else {
            return false;
        }
    }
    
    $scope.getListFn = function(optionSearch) {
        async.auto({
            startLoading: function (cb) {
                loader.show('#loader-search-id');
                cb(null, true);
            },
            getImages: ['startLoading', function(cb) {
                var option = {
                    scope: 'backend',
                    token: $scope.userObject.token,
                    entityKey: 'backend',
                    data: {
                        skip: ($scope.currentPage - 1) * $scope.viewby,
                        limit: $scope.viewby
                    }
                };
                if(optionSearch != undefined) {
                    option.data = _.assignIn(option.data, optionSearch);
                }
                $scope.isFiltering = isInFilteringMode(option.data);
                imageService.imageSelect(option).then(function(resp) {
                    console.log("respppppp", resp);
                    if(resp.result) {
                        var listOfData = resp.data.data.map(function(item) {
                            item.check = false;
                            return item;
                        });
                        $scope.totalItems = resp.data.total;
                        $scope.showTable = false;
                        $scope.changeFilterShow = false;
                        if( _.size(resp.data.data) == 0 && !$scope.isFiltering ) {
                            $scope.dataNull = false;
                            if(optionSearch != undefined) {
                                $scope.content = "No results matched your search. Please try again with different criteria.";
                            } else {
                                $scope.content = "No image has been defined yet. Click here to create the first image.";
                            }
                            $scope.button = "";
                            cb(null, listOfData);
                        } else if( _.size(resp.data.data) == 0 && $scope.isFiltering ) {
                            $scope.button = "";
                            $scope.changeFilterShow = true;
                            $scope.dataNull = true;
                            $scope.showTable = false;
                            cb(null, listOfData);
                        } else {
                            $scope.dataNull = true;
                            $scope.showTable = true;
                            cb(null, listOfData);
                        }
                    } else {
                        $scope.dataNull = true;
                        cb(null, []);
                    }
                }).catch(function(err) {
                    cb(err);
                });
            }],
            checked: ['getImages', function(cb, result) {
                var listOfData = result.getImages;
                async.filter(listOfData, function(item, cb1) {
                    var index = _.findIndex($scope.$parent.selectedImageArray.array, function(o) {
                        return o.id == item.id;
                    });
                    var indexImage = _.findIndex($scope.$parent.listOfImages, function(o) {
                        return o.id == item.id;
                    });
                    if(index != -1 || indexImage != -1) {
                        item.check = true;
                    }
                    cb1(null, true);
                }, function() {
                    $scope.listOfData = listOfData;
                    cb(null, true);
                });
            }]
        }, function(errors) {
            if(errors != null) {
                toastr.error(errors, 'Image', {timeOut: settings.delayToastrTime});
            }
            loader.hide('#loader-search-id');
            $timeout(function() {
                $('#masonrySelect').masonry('reloadItems');
                $('#masonrySelect').masonry('layout');
            }, 1000);
            $scope.$apply();
        });
    };
    $scope.getListFn();
    
    $scope.$on('optionSearchDirective', function(event, value) {
        $scope.getListFn(value);
    });

    $scope.checkedImage = function(image) {
        if(image.check) {
            $scope.$parent.selectedImageArray.array.push(image);
        } else {
            $scope.$parent.selectedImageArray.array = $scope.$parent.selectedImageArray.array.filter(function(item) {
                return item.id != image.id;
            });
        }
        // console.log()
        // $scope.$emit('selectedImageArray.array', $scope.$parent.selectedImageArray.array);
    };
});