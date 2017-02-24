myApp.compileProvider.directive("imageSearchBackendDirective", function() {
    return {
        restrict: "E",
        scope: {},
        templateUrl: '/app/components/directives/image-search/view/image-search-backend-template.html',
        controller: 'imageSearchBackendDirectiveController'
    };
});
myApp.controllerProvider.register("imageSearchBackendDirectiveController", function( $scope, imageService, userService, $localStorage, loader, settings, imageCategoryService, publisherService, imageTagService ) {
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
    $scope.isActive = true;
    $scope.category = {};
    $scope.publisher = {};
    $scope.tag = {};
    async.auto({
        startLoading: function(cb) {
            loader.show('.portlet');
            cb(null, true);
        },
        category: ['startLoading', function(cb) {
            var option = {
                scope: 'backend',
                token: $scope.userObject.token,
                entityKey: 'backend',
                data: {
                    limit: settings.findWhereLimit
                }
            };
            imageCategoryService.getAllImageCategory(option).then(function(resp) {
                if(resp.result){
                    $scope.allCategories = resp.data;
                    $scope.categories = _.cloneDeep($scope.allCategories);
                } else {
                    $scope.categories = [];
                    toastr.error('Category', resp.data.error, {timeOut: settings.delayToastrTime});
                }
                cb(null, true);
            }).catch(function(err) {
                toastr.error('Category', err, {timeOut: settings.delayToastrTime});
                cb(null, true);
            });
        }],
        publisher: ['startLoading', function(cb) {
            var option = {
                scope: 'backend',
                token: $scope.userObject.token,
                entityKey: 'backend',
                data: {
                    limit: settings.findWhereLimit
                }
            };
            publisherService.getAllPublisher(option).then(function(resp) {
                if(resp.result){
                    $scope.allpublishers = resp.data;
                    $scope.publishers = _.cloneDeep($scope.allpublishers);
                } else {
                    $scope.publishers = [];
                    toastr.error('Publisher', resp.data.error, {timeOut: settings.delayToastrTime});
                }
                cb(null, true);
            }).catch(function(err) {
                toastr.error('Publisher', err, {timeOut: settings.delayToastrTime});
                cb(null, true);
            });
        }],
        tags: ['startLoading', function(cb) {
            var option = {
                scope: 'backend',
                token: $scope.userObject.token,
                entityKey: 'backend',
                data: {
                    limit: settings.findWhereLimit
                }
            };
            imageTagService.findTags(option).then(function(resp) {
                if(resp.result){
                    $scope.allTags = resp.data.list;
                    $scope.tags = _.cloneDeep($scope.allTags);
                } else {
                    $scope.tags = [];
                    toastr.error('Tag', resp.data.error, {timeOut: settings.delayToastrTime});
                }
                cb(null, true);
            }).catch(function(err) {
                toastr.error('Tag', err, {timeOut: settings.delayToastrTime});
                cb(null, true);
            });
        }]
    }, function() {
        $scope.$apply();
        loader.hide('.portlet');
    });
    $scope.search = function() {
        $scope.optionSearch = {};
        if($scope.title != undefined && $scope.title != '') {
            $scope.optionSearch.title = {contains: $scope.title}
        }
        
        if($scope.isActive != undefined && $scope.isActive != null){
            $scope.optionSearch.isActive = $scope.isActive.toString() === 'true';
        }
        
        if($scope.category.item != undefined && $scope.category.item != null && $scope.category.item != '') {
            $scope.optionSearch.imageCategoryOwner = $scope.category.item['_id'];
        }
        
        if($scope.publisher.item != undefined && $scope.publisher.item != null && $scope.publisher.item != '') {
            $scope.optionSearch.publisherOwner = $scope.publisher.item['_id'];
        }
        
        if($scope.imageType != undefined && $scope.imageType != null && $scope.imageType != '') {
            $scope.optionSearch.imageType = $scope.imageType;
        }
        
        if($scope.direction != undefined && $scope.direction != null && $scope.direction != '') {
            $scope.optionSearch.direction = $scope.direction;
        }

        if($scope.safeMode != undefined && $scope.safeMode != null && $scope.safeMode != '') {
            $scope.optionSearch.safeMode = $scope.safeMode;
        }
        
        if($scope.tag.item != undefined && $scope.tag.item != null && $scope.tag.item != '') {
            $scope.optionSearch.tags = $scope.tag.item;
        }
        
        if(($scope.countOfDownloadsFrom != undefined && $scope.countOfDownloadsFrom != null && $scope.countOfDownloadsFrom != '') && ($scope.countOfDownloadsTo != undefined && $scope.countOfDownloadsTo != null && $scope.countOfDownloadsTo != '')) {
            $scope.optionSearch.countOfDownloads = {
                '>=': $scope.countOfDownloadsFrom,
                '<=': $scope.countOfDownloadsTo
            }
        } else if(($scope.countOfDownloadsFrom != undefined && $scope.countOfDownloadsFrom != null && $scope.countOfDownloadsFrom != '') && !($scope.countOfDownloadsTo != undefined && $scope.countOfDownloadsTo != null && $scope.countOfDownloadsTo != '')) {
            $scope.optionSearch.countOfDownloads = {
                '>=': $scope.countOfDownloadsFrom
            }
        } else if(!($scope.countOfDownloadsFrom != undefined && $scope.countOfDownloadsFrom != null && $scope.countOfDownloadsFrom != '') && ($scope.countOfDownloadsTo != undefined && $scope.countOfDownloadsTo != null && $scope.countOfDownloadsTo != '')) {
            $scope.optionSearch.countOfDownloads = {
                '<=': $scope.countOfDownloadsTo
            }
        }

        if(($scope.countOfClicksFrom != undefined && $scope.countOfClicksFrom != null && $scope.countOfClicksFrom != '') && ($scope.countOfClicksTo != undefined && $scope.countOfClicksTo != null && $scope.countOfClicksTo != '')) {
            $scope.optionSearch.countOfClicks = {
                '>=': $scope.countOfClicksFrom,
                '<=': $scope.countOfClicksTo
            }
        } else if(($scope.countOfClicksFrom != undefined && $scope.countOfClicksFrom != null && $scope.countOfClicksFrom != '') && !($scope.countOfClicksTo != undefined && $scope.countOfClicksTo != null && $scope.countOfClicksTo != '')) {
            $scope.optionSearch.countOfClicks = {
                '>=': $scope.countOfClicksFrom
            }
        } else if(!($scope.countOfClicksFrom != undefined && $scope.countOfClicksFrom != null && $scope.countOfClicksFrom != '') && ($scope.countOfClicksTo != undefined && $scope.countOfClicksTo != null && $scope.countOfClicksTo != '')) {
            $scope.optionSearch.countOfClicks = {
                '<=': $scope.countOfClicksTo
            }
        }
        $scope.$emit('optionSearchDirective', $scope.optionSearch);
        // console.log("$scope.optionSearch", $scope.optionSearch);
    };
    $scope.resetSearch = function() {
        $scope.isActive = true;
        $scope.category = {};
        $scope.publisher = {};
        $scope.imageType = '';
        $scope.title = '';
        $scope.direction = '';
        $scope.safeMode = '';
        $scope.tag = {};
        $scope.countOfDownloadsFrom = '';
        $scope.countOfDownloadsTo = '';
        $scope.countOfClicksFrom = '';
        $scope.countOfClicksTo = '';
        $scope.$emit('optionSearchDirective', undefined);
    }
});