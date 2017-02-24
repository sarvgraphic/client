myApp.provide.service('userService', function( ioService, $rootScope, $state, $localStorage ) {
    var resourceName = 'users';
    return {
        
        'existUserName': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'GET',
                    url: '/' + resourceName + '/action/existUserName',
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                ioService.request(theOption).then(function( response ) {
                    resolve(response.data);
                }).catch(function( err ) {
                    reject(err);
                });
            });
        }, 'existEmail': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'GET',
                    url: '/' + resourceName + '/action/existEmail',
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                ioService.request(theOption).then(function( response ) {
                    resolve(response.data);
                }).catch(function( err ) {
                    reject(err);
                });
            });
        }, 'signUp': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'POST',
                    url: '/' + resourceName + '/action/sign-up',
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                ioService.request(theOption).then(function( response ) {
                    resolve(response.data);
                }).catch(function( err ) {
                    reject(err);
                });
            });
        },

        'findUser': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/find',
                    data: params.data,
                    scope: params.scope,
                    token : params.token,
                    entityKey : params.entityKey,
                    headers: params.headers || {}
                };
                ioService.request(theOption).then(function(response) {
                    resolve( response.data );
                }).catch(function(err){
                    reject( err );
                });
            });
        },

        'createUser': function( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'POST',
                    url: '/'+ resourceName + '/action/create',
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                ioService.request(theOption).then(function(response) {
                    resolve( response.data );
                }).catch(function(err){
                    reject( err );
                });
            });
        },

        'login': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'POST',
                    url: '/' + resourceName + '/action/login',
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                ioService.request(theOption).then(function( response ) {
                    resolve(response.data);
                }).catch(function( err ) {
                    reject(err);
                });
            });
        },

        'logout': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'POST',
                    url: '/' + resourceName + '/action/logout',
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                ioService.request(theOption).then(function( response ) {
                    resolve(response.data);
                }).catch(function( err ) {
                    reject(err);
                });
            });
        },

        'addTo': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'POST',
                    url: '/' + resourceName + '/action/add',
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                ioService.request(theOption).then(function( response ) {
                    resolve(response.data);
                }).catch(function( err ) {
                    reject(err);
                });
            });
        },

        // 'destroy': function( theOption ) { // DELETE /:model/:record
        //
        //     var defer = $q.defer();
        //     theOption.method = 'DELETE';
        //     theOption.url = serviceAddress + '/' + modelName + '/' + theOption.config.id;
        //     io.socket.request(theOption, function( response ) {
        //         if( response ) {
        //             defer.resolve(response);
        //         } else {
        //             defer.reject(response);
        //         }
        //
        //     });
        //     return defer.promise;
        // },

        'findOneUser' : function ( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + "/" + params.data.id,
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                console.log("theOption :: ", theOption)
                ioService.request(theOption).then(function(response) {
                    resolve( response.data );
                }).catch(function(err){
                    reject( err );
                });
            });
        },

        'updateOneUser' : function ( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'PUT',
                    url: '/'+ resourceName + "/update/" + params.data.userId,
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                ioService.request(theOption).then(function(response) {
                    resolve( response.data );
                }).catch(function(err){
                    reject( err );
                });
            });
        },

        'deleteUser' : function ( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'DELETE',
                    url: '/'+ resourceName + "/delete",
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                ioService.request(theOption).then(function(response) {
                    resolve( response.data );
                }).catch(function(err){
                    reject( err );
                });
            });
        },

        'changePassword' : function ( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'POST',
                    url: '/'+ resourceName + "/change_password",
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                ioService.request(theOption).then(function(response) {
                    resolve( response.data );
                }).catch(function(err){
                    reject( err );
                });
            });
        },

        // 'validateUser': function( scope, loginPageStatus ) {
        //     var userCeckIsLoginLocalDB = new db( scope, 'public');
        //     userCeckIsLoginLocalDB.create();
        //     userCeckIsLoginLocalDB.get("isLogin").then(function (resp) {
        //         $rootScope.isLogin = resp;
        //         $rootScope.$emit("changeIsLogin");
        //         if(resp){
        //             if(loginPageStatus == "beforeLogin"){
        //                 $state.go("root.dashboard");
        //             }
        //         } else {
        //             if(loginPageStatus == "afterLogin"){
        //                 $state.go("root.login");
        //             }
        //         }
        //         // if(!$rootScope.$$phase){
        //         //     $rootScope.$apply();
        //         // }
        //     });
        // }

        'validateUser' : function (appType, currentPath, loginPageStatus, parentUrlPrefix) {
            
            var isLogin = $localStorage[ currentPath ] && $localStorage[ currentPath ].isLogin === true;
            
            if(isLogin){
               
                if(loginPageStatus == "beforeLogin"){
                    switch(appType){
                        case "backend" :
                            if(!$localStorage[ currentPath ].userObject){
                                $state.go(parentUrlPrefix + ".login");
                            }else{
                                $state.go(parentUrlPrefix + ".dashboard");
                            }
                            break;
                        default :
                            $state.go(parentUrlPrefix + ".dashboard");
                            break;
                    }
                }else{
                    switch(appType){
                        case "backend" :
                            if(!$localStorage[ currentPath ].userObject){
                                $state.go(parentUrlPrefix + ".login");
                            }
                            break;
                        default :
                            // $state.go(parentUrlPrefix + ".dashboard");
                            break;
                    }
                }
            }else{
                if(loginPageStatus == "afterLogin"){
                    $state.go(parentUrlPrefix + ".login");
                }
            }

        }
        
    };
});
