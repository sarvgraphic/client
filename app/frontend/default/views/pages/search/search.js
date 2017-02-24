myApp.controllerProvider.register('SearchCtrl', function( $scope, $timeout, $stateParams, imageService, $location, $rootScope, settings, imageCategoryService ) {
    $('#myDropdown .dropdown-menu').on({
        "click": function( e ) {
            e.stopPropagation();
        }
    });


    $scope.path = settings.path.pathAppApi;
    $scope.date = new Date().getTime();

    $scope.imageCategoryModel = {};
    //pagination
    $scope.records = [ { 'num': '5', 'value': 5 }, { 'num': '10', 'value': 10 }, {
        'num': '15', 'value': 15
    }, { 'num': '20', 'value': 20 } ];
    $scope.viewby = 20;
    // $scope.totalItems = $scope.carts.length;
    // $scope.totalItems =200;
    $scope.currentPage = 1;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 5; //Number of pager buttons to show
    $scope.pageChanged = function() {
        $scope.searchFun();
    };

    $scope.setItemsPerPage = function( num ) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        $scope.searchFun();
    };
    $scope.searchObject = JSON.parse($stateParams.searchData);

    //$scope.$emit('searchDirectiveData', $scope.searchObject);

    $scope.getImageCategory = function() {
        async.auto({
            startLoading: function( cb ) {
                cb(null, true);
            },
            getCategory: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        scope: 'website',
                        skip: 0,
                        limit: settings.findLimit
                    }
                };
                if( [ 'Photo', 'Vector', 'Illustration', 'Icon' ].indexOf($scope.searchObject[ 'type' ]) > -1 ) {
                    option.data[ 'imageType' ] = $scope.searchObject[ 'type' ];
                }
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
        }, function( err, result ) {
            if( err ) {
                console.log(err);

            } else {

                $scope.imageCategoryData = [ { title: '--< All Category >--', id: '' } ];
                $scope.imageCategoryData = $scope.imageCategoryData.concat(result.getCategory);
                $timeout(function() {
                    if( $scope.searchObject && $scope.searchObject[ 'moreQuery' ] && $scope.searchObject[ 'moreQuery' ][ 'imageCategoryOwner' ] ) {
                        var index = _.findIndex($scope.imageCategoryData, function( o ) {
                            return o.id == $scope.searchObject[ 'moreQuery' ][ 'imageCategoryOwner' ]
                        });
                        if( $scope.imageCategoryData && $scope.imageCategoryData[ index ] ) {
                            $scope.imageCategoryModel = $scope.imageCategoryData[ index ];
                            $scope.searchFilterTag.push({
                                title: "Category : " + $scope.imageCategoryData[ index ][ 'title' ],
                                value: 'category'
                            });
                        } else {
                            $scope.imageCategoryModel = $scope.imageCategoryData[ 0 ]
                        }

                    } else {
                        $scope.imageCategoryModel = $scope.imageCategoryData[ 0 ]
                    }
                }, 100)

            }
        })
    };
    $scope.getImageCategory();

    $scope.changeImageCategory = function( selectedCat ) {
        if( selectedCat && selectedCat.id ) {
            $scope.imageCategoryId = selectedCat.id
        } else {
            $scope.imageCategoryId = ''
        }

    };

    //$('#myDropdown .dropdown-menu').popover({animation:true, html:true});

    $scope.closeMoreSearchBox = function() {
        $('#popover-button').popover('hide');
    };

    $scope.createSearchFilterTag = function() {
        $scope.searchFilterTag = [];
        for( var i = 0; i < _.size($scope.searchObject); i++ ) {
            switch( Object.keys($scope.searchObject)[ i ] ) {
                case 'type':
                    if( $scope.searchObject[ Object.keys($scope.searchObject)[ i ] ] != 'All Images' ) {
                        $scope.searchFilterTag.push({
                            title: $scope.searchObject[ Object.keys($scope.searchObject)[ i ] ],
                            value: 'type'
                        });
                    }

                    break;
                case 'orientation':
                    $scope.searchFilterTag.push({
                        title: $scope.searchObject[ Object.keys($scope.searchObject)[ i ] ],
                        value: 'orientation'
                    });
                    break;

                case 'moreQuery':
                    var moreQueryFilterData = $scope.searchObject[ Object.keys($scope.searchObject)[ i ] ];
                    if( moreQueryFilterData[ 'imageCategoryOwner' ] ) {
                        var index = _.findIndex($scope.imageCategoryData, function( o ) {
                            return o.id == $scope.searchObject[ 'moreQuery' ][ 'imageCategoryOwner' ]
                        });
                        if( $scope.imageCategoryData && $scope.imageCategoryData[ index ] ) {
                            var findCat = _.findIndex($scope.searchFilterTag, function( o ) {
                                return o.value == 'category'
                            });
                            if( findCat == -1 ) {
                                $scope.searchFilterTag.push({
                                    title: "Category : " + $scope.imageCategoryData[ index ][ 'title' ],
                                    value: 'category'
                                });
                            }
                        }
                    }
                    if( moreQueryFilterData[ 'safeMode' ] ) {
                        moreQueryFilterData[ 'safeMode' ].forEach(function( item ) {
                            $scope.searchFilterTag.push({
                                title: "Mode : " + item,
                                value: item
                            });
                        })

                    }
                    break;
            }

        }
    };
    $scope.createSearchFilterTag();

    //$scope.searchFilter = function( filterData ) {
    //    $scope.currentPage = 1;
    //    $scope.searchFun(filterData)
    //};

    $scope.searchFun = function( filterData ) {

        $scope.filterData = filterData || $scope.filterData;
        async.auto({
            startLoading: function( cb ) {
                cb(null, true);

            },
            createSearchData: [ 'startLoading', function( cb, result ) {
                var arrayOfSearchData = [];
                if($scope.searchObject[ 'query' ]){
                    arrayOfSearchData.push($scope.searchObject[ 'query' ]);
                    console.log("$scope.searchObject[ 'query' ] : ", $scope.searchObject[ 'query' ])

                    if( $scope.searchObject && $scope.searchObject[ 'space' ] != 'Match' ) {
                        var newData = $scope.searchObject[ 'query' ].replace(/\s+/g, ' ').trim();
                        arrayOfSearchData = _.uniq(arrayOfSearchData.concat(newData.split(' ')));
                    }
                    console.log("arrayOfSearchData : ", arrayOfSearchData)
                }

                cb(null, arrayOfSearchData)
            } ], getSearchData: [ 'createSearchData', function( cb, result ) {
                var imageType;
                if( $scope.searchObject[ 'type' ] == 'allImages' ) {
                    imageType = '';
                } else {
                    imageType = $scope.searchObject[ 'type' ];
                }
                var option = {
                    data: {
                        skip: (
                        $scope.currentPage - 1) * $scope.viewby,
                        limit: $scope.viewby,
                        imageType: imageType == "All Images"? '': imageType,
                        scope: 'website',
                        searchData: result.createSearchData
                    }
                };
                if( $scope.searchObject && $scope.searchObject[ 'orientation' ] ) {
                    option.data[ 'direction' ] = $scope.searchObject[ 'orientation' ];
                }
                if( $scope.searchObject && $scope.searchObject[ 'moreQuery' ] && _.size($scope.searchObject[ 'moreQuery' ]) > 0 ) {
                    option.data = _.assign(option.data, $scope.searchObject[ 'moreQuery' ])
                }
                if( filterData == 'new' ) {
                    option.data[ 'newArrival' ] = true;
                }

                imageService.get_search(option).then(function( resp ) {
                    if( resp.result ) {
                        cb(null, resp);
                    } else {
                        cb(resp);
                    }
                }).catch(function( err ) {
                    cb(err);
                });

            } ]
        }, function( err, result ) {
            $scope.totalItems = result.getSearchData[ 'metadata' ][ 'count' ];
            $scope.searchData = result.getSearchData[ 'data' ];
            $timeout(function() {
                $scope.$apply()
                $container.imagesLoaded(function() {
                    $timeout(function() {
                        $scope.$apply();
                        $('#masonry').masonry('reloadItems')
                        $('#masonry').masonry('layout')
                    }, 10)
                });
            }, 10);
        })
    };

    var $container = $('#masonry');
    //
    //$scope.testClick = function() {
    //    alert('click')
    //};

    $scope.searchUrl = function( searchParam, searchItem, searchOrientation, moreQuery, space ) {
        if( searchParam ) {
            $scope.searchObject[ 'type' ] = searchParam;
        }
        if( searchItem ) {
            $scope.searchObject[ 'query' ] = searchItem;
        }
        if( searchOrientation ) {
            $scope.searchObject[ 'orientation' ] = searchOrientation;
        }
        if( moreQuery && _.size(moreQuery) > 0 ) {
            $scope.searchObject[ 'moreQuery' ] = moreQuery;
        }
        if( space) {
            $scope.searchObject[ 'space' ] = space;
        }

        $rootScope.stateSearch = 'filter';
        $scope.currentPage = 1;
        $scope.searchFun();
        $location.path("/search/" + JSON.stringify($scope.searchObject));
        $scope.createSearchFilterTag();
    };

    if( $scope.searchObject && _.size($scope.searchObject) ) {
        $scope.searchUrl()
    }
    $scope.searchImageType = function( filterData ) {
        $scope.filterData = filterData || $scope.filterData;
        $scope.searchUrl('', '', '', '', $scope.filterData);
    };
    if( $scope.searchObject && $scope.searchObject[ 'space' ] ) {
        $scope.filterData = $scope.searchObject[ 'space' ];
    } else {
        $scope.filterData = 'Popular';
    }

    //$scope.moreSearch = {};
    //$scope.safeSearch = true;
    $scope.setMoreSearch = function() {
        //$scope.moreSearch = {};
        $scope.moreQuery = {};
        if( $scope.imageCategoryId ) {
            $scope.moreQuery[ 'imageCategoryOwner' ] = $scope.imageCategoryId;
        }

        if( $scope.excludeKeywords ) {
            $scope.moreQuery[ 'excludeKeywords' ] = $scope.excludeKeywords;
        }
        var modeImage = [];
        if( $scope.safeSearch ) {
            modeImage.push('Safe');
        }

        if( $scope.plusTwelveSearch ) {
            modeImage.push('+12');
        }

        if( $scope.plusSixteenSearch ) {
            modeImage.push('+16');
        }

        if( $scope.plusEighteenSearch ) {
            modeImage.push('+18');
        }

        if( modeImage && modeImage.length > 0 ) {
            $scope.moreQuery[ 'safeMode' ] = modeImage;
        }

        $scope.searchUrl('', '', '', $scope.moreQuery);
        //$scope.searchFun();
    };

    if( $scope.searchObject && _.size($scope.searchObject) ) {
        $scope.searchUrl()
    }
    //$scope.setMoreSearch();

    $scope.setMoreSearchUrl = function( searchMoreData ) {
        if( searchMoreData ) {
            if( searchMoreData[ 'safeMode' ] ) {
                if( searchMoreData[ 'safeMode' ].indexOf('Safe') > -1 ) {
                    $scope.safeSearch = true;
                }
                if( searchMoreData[ 'safeMode' ].indexOf('+12') > -1 ) {
                    $scope.plusTwelveSearch = true;
                }
                if( searchMoreData[ 'safeMode' ].indexOf('+16') > -1 ) {
                    $scope.plusSixteenSearch = true;
                }
                if( searchMoreData[ 'safeMode' ].indexOf('+18') > -1 ) {
                    $scope.plusEighteenSearch = true;
                }
            }

            if( searchMoreData[ 'excludeKeywords' ] ) {
                $scope.excludeKeywords = searchMoreData[ 'excludeKeywords' ];
            }

        }
    };

    if( $scope.searchObject[ 'moreQuery' ] ) {
        $scope.setMoreSearchUrl($scope.searchObject[ 'moreQuery' ]);
    }

    $scope.changeSearchType = function( type ) {
        switch( type ) {
            case 'allImage':
                $scope.imageSearchType = 'All Images';
                $scope.imageSearchTypeDb = 'All Images';
                break;
            case 'Photo':
                $scope.imageSearchType = 'Photos';
                $scope.imageSearchTypeDb = 'Photo';
                break;
            case 'Vector':
                $scope.imageSearchType = 'Vectors';
                $scope.imageSearchTypeDb = 'Vector';
                break;
            default:
                $scope.imageSearchType = 'Action';
                break;
        }

        if( $scope.imageSearchType != 'Action' ) {
            $scope.searchUrl($scope.imageSearchTypeDb)

        }
        $scope.getImageCategory();

    };

    if( $scope.searchObject && $scope.searchObject[ 'type' ] ) {
        $scope.imageSearchType = $scope.searchObject[ 'type' ];
    } else {
        $scope.imageSearchType = 'All Images';
    }

    //$scope.changeSearchType($scope.searchObject[ 'type' ]);

    $scope.changeSearchOrientation = function( orientation ) {
        switch( orientation ) {
            case 'Horizontal':
                $scope.imageSearchOrientation = 'Horizontal';
                break;
            case 'Vertical':
                $scope.imageSearchOrientation = 'Vertical';
                break;

            default:
                $scope.imageSearchOrientation = 'Orientation';
                break;
        }

        if( $scope.imageSearchOrientation != 'Orientation' ) {
            $scope.searchUrl('', '', $scope.imageSearchOrientation)
        }

    };
    if( $scope.searchObject && $scope.searchObject[ 'orientation' ] ) {
        $scope.imageSearchOrientation = $scope.searchObject[ 'orientation' ]
    } else {
        $scope.imageSearchOrientation = 'Orientation';
    }
    //$scope.changeSearchOrientation($scope.searchObject[ 'orientation' ]);

    $scope.removeFilterTag = function( tagRemove ) {
        if( $scope.searchObject && _.size($scope.searchObject) > 0 ) {

            switch( tagRemove ) {
                case 'orientation':
                    delete $scope.searchObject[ tagRemove ];
                    $scope.changeSearchOrientation($scope.searchObject[ 'orientation' ]);
                    break;
                case 'type':
                    delete $scope.searchObject[ tagRemove ];
                    $scope.changeSearchType($scope.searchObject[ 'Action' ]);
                    break;
                case 'category':
                    delete $scope.searchObject[ 'moreQuery' ][ 'imageCategoryOwner' ];

                    $scope.imageCategoryModel = $scope.imageCategoryData[ 0 ]
                    break;
                case '+18':
                    $scope.searchObject[ 'moreQuery' ][ 'safeMode' ].forEach(function( item, i ) {
                        if( item == '+18' ) {
                            $scope.searchObject[ 'moreQuery' ][ 'safeMode' ].splice(i, 1);
                        }

                    });
                    $scope.plusEighteenSearch = false;
                    break;
                case '+12':
                    $scope.searchObject[ 'moreQuery' ][ 'safeMode' ].forEach(function( item, i ) {
                        if( item == '+12' ) {
                            $scope.searchObject[ 'moreQuery' ][ 'safeMode' ].splice(i, 1);
                        }

                    });
                    $scope.plusTwelveSearch = false;
                    break;
                case 'Safe':
                    $scope.searchObject[ 'moreQuery' ][ 'safeMode' ].forEach(function( item, i ) {
                        if( item == 'Safe' ) {
                            $scope.searchObject[ 'moreQuery' ][ 'safeMode' ].splice(i, 1);
                        }

                    });
                    $scope.safeSearch = false;
                    break;
                case '+16':
                    $scope.searchObject[ 'moreQuery' ][ 'safeMode' ].forEach(function( item, i ) {
                        if( item == '+16' ) {
                            $scope.searchObject[ 'moreQuery' ][ 'safeMode' ].splice(i, 1);
                        }

                    });
                    $scope.plusSixteenSearch = false;
                    break;

            }
            if( $scope.searchObject &&
                _.size($scope.searchObject[ 'moreQuery' ]) > 0 &&
                $scope.searchObject[ 'moreQuery' ][ 'safeMode' ] &&
                $scope.searchObject[ 'moreQuery' ][ 'safeMode' ].length == 0
            ) {
                delete $scope.searchObject[ 'moreQuery' ][ 'safeMode' ];
            }
            if( $scope.searchObject && _.size($scope.searchObject[ 'moreQuery' ]) == 0 ) {
                delete $scope.searchObject[ 'moreQuery' ];
            }
            $scope.searchUrl()

        }
    };

    //$timeout(function() {
    //    $scope.$apply();
    //    $('#masonry').masonry('reloadItems')
    //    $('#masonry').masonry('layout')
    //}, 1000)
});