
myApp.controllerProvider.register('HomeCtrl', function($scope, userService, imageCollectionService,imageOfWeekService, $timeout, imageCategoryService, imageTagService, $location) {
    userService.addTo({
        data: {
            test: true
        }
    }).then(function(resp){
        // console.log(resp);
    }).catch(function(err){
        // console.log(err)
    });


    $scope.searchItem = '';
    $scope.setSearchParam = function(data){
        if(data == 'allImages'){
            $scope.searchParam = 'All Images';
        }else{
            $scope.searchParam = data;
        }



    };
    $scope.setSearchParam('allImages');

    $scope.search = function(){
        console.log("searchItem : ", $scope.searchItem)
        console.log("searchParam : ", $scope.searchParam, "#/search/"+$scope.searchItem)

        var urlData = {
            type : $scope.searchParam,
            query : $scope.searchItem
        };
        $location.path("/search/"+JSON.stringify(urlData))


    }

    $scope.getImageCollection = function() {
        async.auto({
            startLoading: function( cb ) {
                //loader.show("#top-feature-of-image-collection");
                cb(null, true);
            },
            getCollection: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        scope: 'website'
                    }
                };
                imageCollectionService.get_top_featured(option).then(function( resp ) {
                    if( resp.result ) {
                        cb(null, resp.data);
                    } else {
                        cb(result.error);
                    }
                }).catch(function( err ) {
                    cb(err);
                });
            } ]
        }, function( err, results ) {

            if(err){
                console.log(err)
            }else{
                $scope.topFeatureOfImageCollection = results.getCollection;
                //loader.hide("#top-feature-of-image-collection");
                $timeout(function(){
                    $scope.$apply();
                })
            }
        });
    };
    $scope.getImageCollection();

    $scope.getImageOfWeek = function() {
        async.auto({
            startLoading: function( cb ) {
                //loader.show("#top-feature-of-image-collection");
                cb(null, true);
            },
            getImage: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        scope: 'website',
                        contentType : 'Photo'
                    }
                };

                imageOfWeekService.get_image_of_week(option).then(function( resp ) {
                    console.log("get_image_of_week : ", resp)
                    if( resp.result ) {
                        cb(null, resp.data);
                    } else {
                        cb(result.error);
                    }
                }).catch(function( err ) {
                    cb(err);
                });
            } ]
        }, function( err, results ) {

            if(err){
                console.log(err)
            }else{
                $scope.imageOfWeek = results.getImage;
                //loader.hide("#top-feature-of-image-collection");
                $timeout(function(){
                    $scope.$apply();
                })
            }
        });
    };
    $scope.getImageOfWeek();

    $scope.getTopImageCategory = function() {
        async.auto({
            startLoading: function( cb ) {
                //loader.show("#image-category-list");
                cb(null, true);
            },
            getTopImageCategory: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        scope: 'website'
                    }
                };
                imageCategoryService.get_top_image_category(option).then(function( resp ) {
                    if( resp.result ) {
                        cb(null, resp.data);
                    } else {
                        cb(result.error);
                    }
                }).catch(function( err ) {
                    cb(err);
                });
            } ]
        }, function( err, results ) {

            if(err){
                console.log(err)
            }else{

                var objectTopImageCategory = {};
                if(results.getTopImageCategory && results.getTopImageCategory.length>0){
                    for(var i = 0; i<results.getTopImageCategory.length;i = i+5){
                        console.log("--",i, i+5,results.getTopImageCategory.length)
                        objectTopImageCategory[i] = results.getTopImageCategory.slice(i, i+5);
                    }
                    $scope.showTopImageCategory = true;
                    $scope.topImageCategory = objectTopImageCategory;
                }else{
                    $scope.showTopImageCategory = false;
                }

                $timeout(function(){
                    $scope.$apply();
                })
            }
        });
    };
    $scope.getTopImageCategory();

    $scope.getTopImageTag = function() {
        async.auto({
            startLoading: function( cb ) {
                //loader.show("#image-category-list");
                cb(null, true);
            },
            getTopImageTag: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        scope: 'website'
                    }
                };
                imageTagService.get_top_image_tag(option).then(function( resp ) {
                    if( resp.result ) {
                        cb(null, resp.data);
                    } else {
                        cb(result.error);
                    }
                }).catch(function( err ) {
                    cb(err);
                });
            } ]
        }, function( err, results ) {

            if(err){
                console.log(err)
            }else{

                var objectTopImageTag = {};
                if(results.getTopImageTag && results.getTopImageTag.length > 0){
                    for(var i = 0; i<results.getTopImageTag.length;i = i+5){
                        console.log(i, i+5)
                        objectTopImageTag[i] = results.getTopImageTag.slice(i, i+5);
                    }
                    $scope.showTopImageTag = true;
                    $scope.topImageTag = objectTopImageTag;

                }else{
                    $scope.showTopImageTag = false;
                }


                $timeout(function(){
                    $scope.$apply();
                })
            }
        });
    };
    $scope.getTopImageTag();

});