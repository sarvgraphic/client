var uploadCount;

myApp.compileProvider.directive('userAvatar', function( settings ) {
    //console.log(settings.path.defaultUserAvatar);
    return {
        restrict: 'E', scope: {
            userId: '=', userStatus: '=?', width: '=', height: '='
        }, templateUrl: function( elm, attr ) {
            return "/app/components/directives/avatar/avatar.html";
        }, controller: function( $rootScope, $scope, settings, $localStorage ) {
            var date = new Date().getTime();

            $rootScope.$on("successlUpload", function( event, result ) {
                uploadCount = result;
                $scope.avatarSrc = settings.path.pathUserAvatar + $scope.userId + "?" + uploadCount;
                $scope.$apply();
            });

            $scope.$on("changeImportImage", function () {
                var newDate = new Date().getTime();
                $scope.avatarSrc = settings.path.pathUserAvatar + $scope.userId + "?" + newDate;
            });

            if( $scope.userStatus != undefined ) {
                $scope.hasUserStatus = true;
            } else {
                $scope.hasUserStatus = false;
            }
            if( $scope.userId == undefined ) {
                $scope.avatarSrc = settings.path.defaultUserAvatar;
            } else {
                $scope.avatarSrc = settings.path.pathUserAvatar + $scope.userId + "?" + date;
            }
            $scope.defaultUserAvatar = settings.path.defaultUserAvatar;
        }
    };
});