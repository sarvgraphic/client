myApp.controllerProvider.register('ImageTagEditCtrl', function ($scope, loader, userService, settings, $localStorage, imageTagService, $q, $state, $stateParams) {

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
    
    async.auto({
        startLoading: function(cb) {
            loader.show('.portlet');
            cb(null, true);
        },
        getImageTag: ['startLoading', function(cb, result) {
            var option = {
                scope : "backend",
                token : $scope.userObject.token,
                entityKey : "backend",
                data : {
                    id: $stateParams.imageTagID
                }
            };
            imageTagService.findImageTag(option).then(function(resp) {
                if(resp.result) {
                    $scope.title = resp.data.title;
                    $scope.isActive = resp.data.isActive;
                } else {
                    toastr.error(resp.message, 'Image Tag', {timeOut: settings.delayToastrTime});
                }
                cb(null, true);
            }).catch(function(err) {
                toastr.error(err, 'Image Tag', {timeOut: settings.delayToastrTime});
                cb(null, true);
            });
        }]
    }, function() {
        $scope.$apply();
        App.init();
        loader.hide('.portlet');
    });

    $scope.isRequired = function(val){
        return !validate.isEmpty(val);
    };

    $scope.exist = function(val, field) {
        var option = {
            scope : "backend",
            token : $scope.userObject.token,
            entityKey : "backend",
            data : {
                id: {'!': [ $stateParams.imageTagID ]}
            }
        };
        option.data[ field ] = val;
        var defer = $q.defer();
        imageTagService.exist(option).then(function(resp) {
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
        var option = {
            scope : "backend",
            token : $scope.userObject.token,
            entityKey : "backend",
            data : {
                title: $scope.title,
                isActive: $scope.isActive,
                id: $stateParams.imageTagID
            }
        };
        imageTagService.update(option).then(function(resp) {
            if(resp.result){
                $state.go("root.imageTagList");
            } else {
                toastr.error('Image Tag', resp.message, {timeOut: settings.delayToastrTime});
            }
        }).catch(function(err) {
            toastr.error('Image Tag', err, {timeOut: settings.delayToastrTime});
        });
    };

});