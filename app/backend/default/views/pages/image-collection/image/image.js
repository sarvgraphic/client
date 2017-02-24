myApp.controllerProvider.register('ImageCollectionImageCtrl', function ($scope, userService, settings, $timeout, $localStorage, loader, imageCollectionService, imageService, $compile, $stateParams, $state) {

    /**
     * check isLogin
     * @type {db}
     */
    userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");

    $scope.localStorageAddress = $localStorage[ $localStorage.sscCurrentPath ];

    if(!$scope.userObject){
        $scope.userObject = $scope.localStorageAddress.userObject;
    }

    $scope.selectedImageArray = {array: []};
    $scope.dataNull = undefined;
    $scope.content = "No image has been selected yet. Click here to selected the image(s).";
    $scope.icon = "price.png";
    $scope.background = "";
    $scope.button = "";
    $scope.date = new Date().getTime();
    $scope.path = settings.path.pathAppApi;
    $scope.selectedImageArray = {
        array: []
    };
    $scope.collectionTitle = $stateParams.imgCollectionTitle;
    $scope.openModal = function() {
        if( $scope.load ) {
            $scope.directiveScope.$destroy();
            $("#add-directive-id").empty();
        }
        $scope.directiveScope = $scope.$new();
        $scope.load = true;
        $timeout(function(){
            // console.log("$scope.selectedImageArray.array", $scope.selectedImageArray.array);
            $('#add-directive-id').append($compile('<image-select-backend-directive></image-select-backend-directive>')($scope.directiveScope));
        }, 200);
    };

    $scope.selectedImages = function() {
        $('#modal-select-image-id').modal('hide');
        async.auto({
            startLoading: function(cb) {
                loader.show('.portlet-body');
                cb(null, true);
            },
            save: ['startLoading', function(cb) {
                var imageIds = [];
                $scope.selectedImageArray.array.filter(function(item) {
                    imageIds.push(item.id);
                });
                var option = {
                    scope: 'backend',
                    token: $scope.userObject.token,
                    entityKey: 'backend',
                    data: {
                        imageIds : imageIds,
                        id: $stateParams.imgCollectionId
                    }
                };
                imageCollectionService.saveImage(option).then(function(resp) {
                    cb(null, resp);
                }).catch(function(err) {
                    cb(err);
                });
            }]
        }, function(errors, results) {
            if(errors != null) {
                toastr.error("Image", errors, {timeOut: settings.delayToastrTime});
            } else {
                if(!results.save.result) {
                    toastr.error("Image", results.save.error, {timeOut: settings.delayToastrTime});
                }
            }
            $scope.getImageCollection();
            loader.hide('.portlet-body');
            $scope.selectedImageArray = {
                array: []
            };
        });
    };
    $scope.getImageCollection = function() {
        async.auto({
            startLoading: function(cb) {
                loader.show('.portlet-body');
                cb(null, true);
            },
            loadImage: ['startLoading', function(cb) {
                var option = {
                    scope: 'backend',
                    token: $scope.userObject.token,
                    entityKey: 'backend',
                    data: {
                        id: $stateParams.imgCollectionId
                    }
                };
                imageCollectionService.findImagesCollection(option).then(function(resp) {
                    if(_.size(resp.data) === 0 || _.size(resp.data[0].images) === 0 || !_.hasIn(resp.data[0], 'images')) {
                        $scope.dataNull = false;
                        $scope.content = "No image has been selected yet. Click here to selected the image(s).";
                    } else {
                        $scope.dataNull = true;
                    }
                    cb(null, resp.data[0].images);
                }).catch(function(err) {
                    cb(err);
                });
            }]
        }, function(errors, results) {
            loader.hide('.portlet-body');
            $scope.listOfImages = results.loadImage;
            $scope.$apply();
        });
    };
    $scope.getImageCollection();
    
    $scope.setDeleteImage = function(id) {
        $scope.deletetImageId = id;
    };
    
    $scope.deleteImage = function() {
        async.auto({
            startLoading: function(cb) {
                loader.show('.portlet-body');
                cb(null, true);
            },
            deleteImage: ['startLoading', function(cb) {
                var option = {
                    scope: 'backend',
                    token: $scope.userObject.token,
                    entityKey: 'backend',
                    data: {
                        collectionId: $stateParams.imgCollectionId,
                        imageId: $scope.deletetImageId
                    }
                };
                imageCollectionService.deletedImage(option).then(function(resp) {
                    if(!resp.result) {
                        toastr.error('Image', resp.error, {timeOut: settings.delayToastrTime});
                    }
                    cb(null, true);
                }).catch(function(err) {
                    toastr.error('Image', err, {timeOut: settings.delayToastrTime});
                    cb(null, true);
                });
            }]
        }, function() {
            $scope.getImageCollection();
            $('#delete-image-modal-id').modal('hide');
        })
    }
});