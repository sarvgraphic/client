myApp.compileProvider.directive('userAvatarManagement', function( settings ) {


    return {

        restrict: 'E', scope: {
            uploadUserId: '=', imageShape: '@', width: '=', height: '=', tokenId : "=?"
        }, templateUrl: function( elm, attr ) {
            return '/app/components/directives/avatar-management/views/avatar-management.html';
        }, controller: function( $rootScope, $scope, settings, $localStorage, Upload, $timeout ) {

            var uploadCount;
            $(".image-upload > label").mouseover(function() {
                $(".editAvatar").css("display", "block");
            }).mouseout(function() {
                $(".editAvatar").css("display", "none");
            });
            $scope.$on("successUserUpload", function( event, result ) {
                uploadCount = result;
                $scope.avatarSrc = settings.path.pathUserAvatar + $scope.uploadUserId + "?" + uploadCount;
                $scope.$apply();
            });
            if( $scope.uploadUserId == undefined ) {
                $scope.avatarSrc = settings.path.defaultUserAvatar;
            } else {
                $scope.avatarSrc = settings.path.pathUserAvatar + $scope.uploadUserId + "?" + uploadCount;
            }
            $scope.defaultUserAvatar = settings.path.defaultUserAvatar;

            /**
             * Upload user avatar
             * @param file
             * @param errFiles
             */
            $scope.uploadFiles = function( file, errFiles ) {
                var uploadCount = new Date();
                $scope.f = file;
                $scope.errFile = errFiles && errFiles[ 0 ];
                if( file ) {
                    $('#circleLoading').css('border', '5px solid #D91E18');
                    Upload.setDefaults({ ngfMaxSize: 5000000 });
                    file.upload = Upload.upload({
                        //resumeChunkSize : '48KB',
                        method: "POST", url: settings.path.pathAppUploadAvatar + 'action/upload_avatar', data: {
                            userId: $scope.uploadUserId,
                            access_token: $scope.tokenId || $localStorage[ $localStorage.sscCurrentPath ].userObject.token,
                            avatar: file
                        }
                    });
                    file.upload.then(function( response ) {
                        console.log("response  :  ", response);
                        $timeout(function() {
                            file.result = response.data;
                            $scope.f = "";
                            if( !response.data.error ) {
                                $('#circleLoading').css('border', '5px solid #26C281');
                                $scope.$emit("successUserUpload", uploadCount);
                                $rootScope.$broadcast("successlUpload", uploadCount);
                                //App.alert({
                                //    container : $('.avatarAlert'),
                                //    place : 'prepend',
                                //    type : 'success',
                                //    message : settings.avatarChangeSuccess,
                                //    close : true,
                                //    reset : true,
                                //    focus : true,
                                //    closeInSeconds : 5,
                                //    icon : 'fa fa-check'
                                //});
                            } else {
                                App.alert({
                                    container: $('.avatarAlert'),
                                    place: 'prepend',
                                    type: 'danger',
                                    message: response.data.error.message,
                                    close: true,
                                    reset: true,
                                    focus: true,
                                    closeInSeconds: 5,
                                    icon: 'fa fa-warning'
                                });
                            }
                        }, 1000);
                    }, function( response ) {
                        console.log("error  :  ", response);
                        App.alert({
                            container: $('.avatarAlert'),
                            place: 'prepend',
                            type: 'danger',
                            message: "Error has occurred",
                            close: true,
                            reset: true,
                            focus: true,
                            closeInSeconds: 5,
                            icon: 'fa fa-warning'
                        });
                        if( response.status > 0 ) {
                            $scope.errorMsg = response.status + ': ' + response.data;
                        }
                    }, function( evt ) {
                        $('#circleLoading').css('clip', 'rect(0px, ' + $scope.width + 'px, ' + $scope.f.progress * ($scope.width / 100) + 'px, 0px)');
                        console.log("evt 3 :  ", evt);
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
        }
    };
});
