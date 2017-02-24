myApp.controllerProvider.register('headerController', function($document, $scope, userService,$stateParams,$location){




    $scope.isRequired = function( val ) {
        return !validate.isEmpty(val);
    };
    $scope.emailExist = function(val){
        return new Promise(function(resolve, reject){
            if(val != undefined){
                var option = {
                    data: {
                        email : val
                    }
                };
                userService.existEmail(option).then(function(resp){
                    if(resp.result){
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }).catch(function(){
                    reject(false);
                });
            } else {
                resolve(true);
            }
        });
    };
    $scope.hasMinLength = function( val, min ) {
        if(min == undefined){
            min = 6;
        }
        var constraints = {
            from: {
                length: {
                    minimum: min
                }
            }
        };
        return !validate({ from: val }, constraints);
    };
    $scope.isEmail = function( emailValue ) {
        var constraints = {
            from: {
                email: true
            }
        };
        return !validate({ from: emailValue }, constraints);
    };
    $scope.acceptTerms = {check: false};
    $scope.isLogin = false;
    $scope.create = function() {
        async.auto({
            startLoading: function( cb ) {
                // loader.show("#signUpForm");
                cb(null, true);
            },
            createUser: [ 'startLoading', function( cb, result ) {
                var option = {
                    data: {
                        scope: 'website',
                        email: $scope.email,
                        password: $scope.password
                    }
                };
                userService.signUp(option).then(function( resp ) {
                    if( resp.result ) {
                        cb(null, resp.data);
                    } else {
                        cb(result.error);
                    }
                }).catch(function( err ) {
                    cb(err);
                });
            } ],
            updateUserStorage: [ 'createUser', function( cb, result ) {
                var localDB = new db('website', 'public');
                localDB.create();
                localDB.set('userObj', result.createUser.user);
                localDB.set('isLogin', true);
                localDB.set('token', result.createUser.token);
            } ]
        }, function( err, results ) {

        });
    };
    
    
    $scope.signIn = {};
    $scope.login = function() {
        async.auto({
            startLoading: function( cb ) {
                cb(null, true);
            },
            loginUser: [ 'startLoading', function( cb ) {
                var option = {
                    data: {
                        scope: 'website',
                        password: $scope.signIn.password,
                        identifier: $scope.signIn.identifier
                    }
                };
                userService.login(option).then(function( resp ) {
                    console.log("resp", resp);
                    if( resp.result ) {
                        cb(null, resp.data);
                    } else {
                        cb(resp.error);
                    }
                }).catch(function( error ) {
                    cb(error);
                });

            } ],
            updateUserStorage: [ 'loginUser', function( cb, result ) {
                var token = _.cloneDeep(result.loginUser.token);
                _.unset(result.loginUser, 'token');
                var localDB = new db('website', 'public');
                localDB.create();
                localDB.set('userObj', result.loginUser);
                localDB.set('isLogin', true);
                localDB.set('identifier', $scope.signIn.identifier);
                localDB.set('token', token);
                if($scope.rememberMe){
                    localDB.set('rememberMe', true);
                } else {
                    localDB.set('rememberMe', false);
                }
                cb(null, true);
            } ]
        }, function( err, results ) {
            if( err ) {
            console.log("err", err);
            } else {
                $scope.isLogin = true;
                $('#login-form').modal("hide");

            }
            $scope.$apply();
        });
    };


    //$scope.getImageCategory = function() {
    //    async.auto({
    //        startLoading: function( cb ) {
    //             //loader.show("#image-category-list");
    //            cb(null, true);
    //        },
    //        getCategory: [ 'startLoading', function( cb, result ) {
    //            var option = {
    //                data: {
    //                    scope: 'website'
    //                }
    //            };
    //            imageCategoryService.get_image_category(option).then(function( resp ) {
    //                if( resp.result ) {
    //                    cb(null, resp.data);
    //                } else {
    //                    cb(result.error);
    //                }
    //            }).catch(function( err ) {
    //                cb(err);
    //            });
    //        } ]
    //    }, function( err, results ) {
    //
    //        if(err){
    //            console.log(err)
    //        }else{
    //            $scope.imageCategory = results.getCategory;
    //            //loader.hide("#image-category-list");
    //            $timeout(function(){
    //                $scope.$apply();
    //            })
    //        }
    //    });
    //};
    //
    //$scope.getImageCategory();

    //$scope.searchItem = '';
    //$scope.setSearchParam = function(data){
    //    if(data == 'allImages'){
    //        $scope.searchParam = 'All Images';
    //    }else{
    //        $scope.searchParam = data;
    //    }
    //
    //
    //
    //};
    //$scope.setSearchParam('allImages');
    //
    //console.log("$stateParams : ", $stateParams)
    //$scope.search = function(){
    //    console.log("searchItem : ", $scope.searchItem)
    //    console.log("searchParam : ", $scope.searchParam, "#/search/"+$scope.searchItem)
    //
    //    var urlData = {
    //        type : $scope.searchParam,
    //        query : $scope.searchItem
    //    };
    //    $location.path("/search/"+JSON.stringify(urlData))
    //
    //
    //}
});