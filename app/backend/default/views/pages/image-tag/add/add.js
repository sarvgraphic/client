myApp.controllerProvider.register('ImageTagAddCtrl', function ($scope, userService, settings, $localStorage, imageTagService, $q, $state) {

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
    
    $scope.isRequired = function(val){
        return !validate.isEmpty(val);
    };

    $scope.exist = function(val, field) {
        var option = {
            scope : "backend",
            token : $scope.userObject.token,
            entityKey : "backend",
            data : {}
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
                isActive: $scope.isActive
            }
        };
        imageTagService.create(option).then(function(resp) {
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