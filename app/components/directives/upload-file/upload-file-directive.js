myApp.compileProvider.directive('uploadFile', function (settings) {
    return {
        restrict: 'E',
        scope: {
            fileModel: "=", /* 'required' This is the main scope name for directive ng-model, you must send this name to controller for upload file */
            directiveModel: "=", /* 'required' This is the name of directive scope itself and some feature like progress count while uploading exists in this scope */
            type: "@", /* 'required' This is type of element like 'image' NOTE:if you want to edit video use 'edit-video' and for edit file(doc) use 'edit-file' */
            imageHolderId: "@", /* 'required' This is the id of image holder (default image of element) */
            removeBtnId: "@", /* 'required' This is the id of remove button. if you have multi element in one page you must set id for your button. it is recommended to use id even you have one element */
            maxSizeMb: "=", /* 'required' This is the max valid size of file in MB and it must be integer like '15' */
            notFoundImagePath: "@", /* 'required' This is the path for default image you must set this for default or not fount image */
            fileType: "@", /* 'required' This is a string that set acceptable file type. recommended choices: 'image/*' for image type, 'video/*' for video type and '.txt,.pdf,.doc,.docx,.xls,.xlsx' for file */
            formName: "@", /* 'required' Set a form name for reach some directive feature */
            description: "=", /* 'optional' Description for element 'it must set in controller' */
            note: "=", /* 'optional' Some note and sample for element 'it must set in controller' */
            table: "@", /* 'optional' The server model name for get image (use this for type:image in for example edit mode) */
            getImageFunction: "@", /* 'optional' The server action name for get image (use this for type:image in for example edit mode) */
            collectionId: "=", /* 'optional' The id of collection that image add in that collection (use this for type:image in for example edit mode) */
            collectionKey: "=", /* 'optional' The key of item (use this for type:image in for example edit mode) */
            collectionSubKey: "=", /* 'optional' The key of sub item (use this for type:image in for example edit mode) */
            removeFile: "=", /* 'optional' This is the scope name in controller that change to true/false when user click remove button to remove image from that collection in database (use this for edit mode)*/
            boxWidth: "@", /* 'optional' This is the element width set this in integer like '300' and default is 250px */
            removeTitle: "@", /* 'optional' This is the title of remove button */
            removeClass: "@", /* 'optional' This is the class of remove button icons and default is 'fa fa-remove' */
            uploadTitle: "@", /* 'optional' This is the title of upload button */
            uploadClass: "@", /* 'optional' This is the class of upload button icons and default is 'icon-cloud-upload' */
            changeMethod: "&",    /* 'optional' This is the name of custom ng-change method */
            selectMethod : "&",    /* 'optional' This is the name of custom ng-click method */
            setCenter : "@" /* 'optional' if you want directive place in center, set this to 'auto' */
        },
        link: function (scope, element, attrs) {
            if (scope.type == 'edit-video') {
                scope.getTemplateUrl = function () {
                    return '/app/components/directives/upload-file/upload-video-template.html';
                };
            } else if (scope.type == 'edit-file') {
                scope.getTemplateUrl = function () {
                    return '/app/components/directives/upload-file/upload-file-template.html';
                };
            } else {
                scope.getTemplateUrl = function () {
                    return '/app/components/directives/upload-file/upload-template.html';
                };
            }
        },
        template: '<div ng-include="getTemplateUrl()"></div>',
        controller: function ($scope, settings, $timeout, $sce) {

            if($scope.setCenter && $scope.setCenter == "auto"){
                $scope.cetnerAlign = "center";
            }

            $scope.showFileDetail = true;

            $scope.disableRmoveBtn = false;
            var path = settings.path.pathAppApi + "/" + $scope.table + "/" + $scope.getImageFunction;
            var date = new Date().getTime();

            $scope.$on("notFoundImg", function () {
                $(".firstTimeEmpty").css("display", "block");
                $(".uploadFileDiv").css("display", "none");
                if ($scope.fileModel && $scope.fileModel.name) {
                    $scope.showFileDetail = false;
                }
            });

            $timeout(function () {
                $("#" + $scope.removeBtnId).removeClass("ng-hide");
                $("#" + $scope.imageHolderId).removeClass("ng-hide");
                if ($scope.collectionId) {
                    if (!$scope.collectionKey && !$scope.collectionSubKey) {
                        $("#" + $scope.imageHolderId).attr("src", path + "/" + $scope.collectionId + "?" + date);
                    } else if ($scope.collectionKey && !$scope.collectionSubKey) {
                        $("#" + $scope.imageHolderId).attr("src", path + "/" + $scope.collectionId + "/" + $scope.collectionKey + "?" + date);
                    } else {
                        $("#" + $scope.imageHolderId).attr("src", path + "/" + $scope.collectionId + "/" + $scope.collectionKey + "/" + $scope.collectionSubKey + "?" + date);
                    }
                } else {
                    $("#" + $scope.imageHolderId).attr("src", "");
                }
            }, 1500);


            $scope.mainPath = settings.path.pathAppCustomApi;

            /* edit video section */
            if ($scope.type == "edit-video") {
                $scope.videoPath = $scope.mainPath + "/" + $scope.table + "/" + $scope.getImageFunction + "/" + $scope.collectionId + "/" + $scope.collectionKey;
                $scope.config = {
                    sources: [
                        {src: $sce.trustAsResourceUrl($scope.videoPath), type: "video/mp4"}
                    ],
                    theme: "/app/bower_components/videogular-themes-default/videogular.css"
                };
            }

            $scope.hasVideo = true;
            $scope.$on("no-video", function () {
                $scope.hasVideo = false;
            });
            /* END edit video section */


            /* edit file section */
            if ($scope.type == "edit-file") {
                $scope.filePath = $scope.mainPath + "/" + $scope.table + "/" + $scope.getImageFunction + "/" + $scope.collectionId + "/" + $scope.collectionKey;
            }

            $scope.hasFile = true;
            $scope.$on("no-file", function () {
                $scope.hasFile = false;
            });
            $scope.$on("has-file", function (event, passedData) {
                $scope.fileName = passedData.file;
                $scope.fileSize = passedData.size;
            });
            /* END edit file section */


            $scope.remove = function () {
                if ($scope.removeFile != undefined) {
                    $scope.removeFile = true;
                }
                if ($scope.type == "edit-video") {
                    $scope.hasVideo = false;
                }
                if ($scope.type == "edit-file") {
                    $scope.hasFile = false;
                }
                $scope.fileModel = null;
                $scope.disableRmoveBtn = true;
                $timeout(function () {
                    $("#" + $scope.removeBtnId).removeClass("ng-hide");
                    $("#" + $scope.imageHolderId).removeClass("ng-hide");
                    $("#" + $scope.imageHolderId).attr("src", $scope.notFoundImagePath);
                }, 10);
            };


            $scope.changeSelectedFile = function () {

                if($scope.selectMethod){
                    $scope.selectMethod();
                }

                $scope.fileModel = null;
                $timeout(function () {
                    $("#" + $scope.removeBtnId).removeClass("ng-hide");
                    $("#" + $scope.imageHolderId).removeClass("ng-hide");
                    // $("#" + $scope.imageHolderId).attr("src", $scope.notFoundImagePath);
                }, 10);
            };

            $scope.setDefaultPhoto = function () {
                $scope.showFileDetail = true;
                if($scope.changeMethod){
                    $scope.changeMethod();
                }
                
                $(".firstTimeEmpty").css("display", "none");
                $(".uploadFileDiv").css("display", "block");
                if ($scope.fileModel) {
                    $scope.disableRmoveBtn = false;
                }
                if ($scope.type == "video" || $scope.type == "file" || $scope.type == "edit-video" || $scope.type == "edit-file") {
                    $timeout(function () {
                        $("#" + $scope.removeBtnId).removeClass("ng-hide");
                        $("#" + $scope.imageHolderId).removeClass("ng-hide");
                        $("#" + $scope.imageHolderId).attr("src", $scope.notFoundImagePath);
                    }, 10);
                }
            };

        }
    };
});