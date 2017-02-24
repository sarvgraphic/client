
myApp.controllerProvider.register('VectorsCtrl', function($scope, imageCategoryService, $timeout, imageSearchService, imageCollectionService, imageOfWeekService, settings) {
    $scope.path = settings.path.pathAppApi;
    $scope.date = new Date().getTime();
    $scope.getTopImageCategory = function() {
        async.auto({
            startLoading: function( cb ) {
                //loader.show("#image-category-list");
                cb(null, true);
            },
            getTopImageCategory: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        skip : 0,
                        limit : 8,
                        scope: 'website',
                        imageType : 'Vector'
                    }
                };
                imageCategoryService.get_top_image_category(option).then(function( resp ) {
                    console.log("resp : ", resp)
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

                if(results.getTopImageCategory && results.getTopImageCategory.length>0){
                    $scope.showTopImageCategory = true;
                    $scope.topImageCategory = results.getTopImageCategory;
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



    $scope.getTopHitsImageSearch = function() {
        async.auto({
            startLoading: function( cb ) {
                //loader.show("#image-category-list");
                cb(null, true);
            },
            getTopHitsImageSearch: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        scope: 'website',
                        searchArea :['Vector']
                    }
                };
                imageSearchService.get_top_hits_image_search(option).then(function( resp ) {
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

                var objectTopHitsImageSearch = {};
                if(results.getTopHitsImageSearch && results.getTopHitsImageSearch.length>0){
                    for(var i = 0; i<results.getTopHitsImageSearch.length;i = i+5){
                        objectTopHitsImageSearch[i] = results.getTopHitsImageSearch.slice(i, i+5);
                    }
                    $scope.showTopHitsImageSearch = true;
                    $scope.topHitsImageSearch = objectTopHitsImageSearch;
                    console.log("$scope.topHitsImageSearch  : ", $scope.topHitsImageSearch )
                }else{
                    $scope.showTopHitsImageSearch = false;
                }

                $timeout(function(){
                    $scope.$apply();
                })
            }
        });
    };
    $scope.getTopHitsImageSearch();


    $scope.getFeatureCollection = function() {
        async.auto({
            startLoading: function( cb ) {
                //loader.show("#image-category-list");
                cb(null, true);
            },
            getFeatureCollection: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        scope: 'website',
                        contentType :['Vector'],
                        limit : 6
                    }
                };
                imageCollectionService.get_featured(option).then(function( resp ) {
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

                if(results.getFeatureCollection && results.getFeatureCollection.length>0){
                    $scope.showFeatureCollection = true;
                    $scope.featureCollection = results.getFeatureCollection;
                }else{
                    $scope.showFeatureCollection = false;
                }

                $timeout(function(){
                    $scope.$apply();
                })
            }
        });
    };
    $scope.getFeatureCollection();



    $scope.getTopEditorialChooseImage = function() {
        async.auto({
            startLoading: function( cb ) {
                //loader.show("#image-category-list");
                cb(null, true);
            },
            getTopEditorialChooseImage: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        scope: 'website',
                        imageType :['Vector']
                    }
                };
                imageSearchService.get_top_editorial_choose_image(option).then(function( resp ) {
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

                var objectTopEditorialChooseImage = {};
                if(results.getTopEditorialChooseImage && results.getTopEditorialChooseImage.length>0){
                    //for(var i = 0; i<results.getTopEditorialChooseImage.length;i = i+5){
                    //    objectTopEditorialChooseImage[i] = results.getTopEditorialChooseImage.slice(i, i+5);
                    //}
                    $scope.showTopEditorialChooseImage = true;
                    $scope.topEditorialChooseImage = results.getTopEditorialChooseImage;
                    console.log("$scope.topEditorialChooseImageSearch", $scope.topEditorialChooseImage)
                }else{
                    $scope.showTopEditorialChooseImage = false;
                }

                $timeout(function(){
                    $scope.$apply();
                })
            }
        });
    };
    $scope.getTopEditorialChooseImage();


    $scope.getTopEditoralChoose = function() {
        async.auto({
            startLoading: function( cb ) {
                //loader.show("#image-category-list");
                cb(null, true);
            },
            getTopEditoralChoose: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        scope: 'website',
                        searchArea :['Vector']
                    }
                };
                imageSearchService.get_top_editorial_choose(option).then(function( resp ) {
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

                var objectTopEditoralChoose = {};
                if(results.getTopEditoralChoose && results.getTopEditoralChoose.length>0){
                    for(var i = 0; i<results.getTopEditoralChoose.length;i = i+4){
                        objectTopEditoralChoose[i] = results.getTopEditoralChoose.slice(i, i+4);
                    }
                    $scope.showTopEditoralChoose = true;
                    $scope.topEditoralChoose = objectTopEditoralChoose;
                }else{
                    $scope.showTopEditoralChoose = false;
                }

                $timeout(function(){
                    $scope.$apply();
                })
            }
        });
    };
    $scope.getTopEditoralChoose();


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
                        contentType : 'Vector',
                        limit : 1
                    }
                };
                imageOfWeekService.get_image_of_week(option).then(function( resp ) {
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
});