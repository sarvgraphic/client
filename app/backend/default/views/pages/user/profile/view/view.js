
myApp.controllerProvider.register('ProfileCtrl', 
    function( $scope,
              $stateParams,
              userService,
              $timeout,
              settings,
              $rootScope,
              $state,
              $localStorage,
              backendConfig,
              loader ) 
    {

        /**
         * check isLogin
         * @type {db}
         */
        userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");

        $scope.localStorageAddress = $localStorage[ $localStorage.sscCurrentPath ];
        $scope.userDetailProfile = {};

        $scope.userProfileID = $stateParams.userId;

        if(!$scope.userObject){
            $scope.userObject = $scope.localStorageAddress.userObject;
        }

        if($scope.userProfileID == $scope.userObject.id){
            $scope.isOwner = true;
        }


        /**
         * find selected user
         */
        async.auto({
            startLoading : function (callback) {
                loader.show(".viewLoading");
                callback(null, true);
            },
            findUser : function (callback) {

                var option = {
                    scope : "backend",
                    data : {
                        id : $stateParams.userId
                    }
                };

                console.log("option : ", option);

                userService.findOneUser(option).then(function (resp) {
                    console.log("resp :: ", resp);
                    callback(null, resp);
                }).catch(function (err) {
                    console.log("err :: ", err);
                    callback(err);
                })
            }
        }, function (errors, results) {
            loader.hide(".viewLoading");
            if(errors){
                toastr.error('Unknown error', '', { timeOut: settings.delayToastrTime });
            } else if (!results.findUser.result){
                toastr.error(results.findUser.message, '', { timeOut: settings.delayToastrTime });
            } else {
                $scope.userObj = results.findUser.data;
                $scope.$apply();
            }
        });


    
        // async.auto({
        //     startLoading: function( callback ) {
        //         loader.show(".viewLoading");
        //         callback(null, true);
        //     }, checkOwner: [ 'startLoading', function( callback, result ) {
        //         userService.isOwner($stateParams.id, $localStorage.myApp).then(function( result ) {
        //             callback(null, result);
        //         });
        //     } ], getUserData: [ 'checkOwner', function( callback, result ) {
        //         $scope.isOwner = result.checkOwner;
        //
        //         // var option = {
        //         //     config: {}, params: {
        //         //         user: {
        //         //             id: $stateParams.id
        //         //         }, connect: {
        //         //             entityCollection: "retailer",
        //         //             entityId: $localStorage[ $localStorage.myApp ].retailerObj.id, // params : {}
        //         //             params: {}
        //         //         }
        //         //     }
        //         // };
        //         //
        //         // userService.findAndConnect(option).then(function( result ) {
        //         //     console.log("2222222", result)
        //         //     callback(null, result[ 0 ]);
        //         // }).catch(function( error ) {
        //         //     callback(error);
        //         // });
        //
        //         var option = {
        //             config: {},
        //             params: {
        //                 connect: {
        //                     params: {
        //                         clientOwner : $scope.clientOwner
        //                     }
        //                 },
        //                 user : {
        //                     id : $stateParams.id
        //                 }
        //             }
        //         };
        //         option.config = util.createConfig({}, "datalink", $localStorage.myApp);
        //         clientUserService.findAll(option).then(function( data ) {
        //             console.log("data ::::", data);
        //             callback(null, data);
        //         }).catch(function( error ) {
        //             console.log("error ::", error);
        //             callback(error);
        //         });
        //
        //     } ], updateView: [ 'getUserData', function( callback, result ) {
        //
        //         if( result.getUserData && (result.getUserData.data[0].companyName != '-' || !result.getUserData.data[0].companyName) ) {
        //             $scope.companyName = result.getUserData.companyName;
        //         } else {
        //             result.getUserData.data[0].companyName = '';
        //         }
        //
        //         if( result.getUserData && (result.getUserData.data[0].firstname != '-' || !result.getUserData.data[0].firstname) ) {
        //             $scope.firstName = result.getUserData.firstname;
        //         } else {
        //             result.getUserData.data[0].firstname = '';
        //         }
        //
        //         if( result.getUserData && (result.getUserData.data[0].lastname != '-' || !result.getUserData.data[0].lastname) ) {
        //             $scope.lastName = result.getUserData.data[0].lastname;
        //         } else {
        //             result.getUserData.data[0].lastname = '';
        //         }
        //
        //
        //
        //         $scope.loadNotification();
        //         $scope.userDetailProfile = result.getUserData.data[0];
        //         // console.log(999,$scope.userDetailProfile)
        //         $scope.$apply();
        //         callback(null, true);
        //     } ]
        // }, function( err, results ) {
        //     loader.hide(".viewLoading");
        // });
    
        // // get user notification
        // $scope.loadNotification = function() {
        //     async.auto({
        //         loadingStart: function( callback ) {
        //             loader.show(".page-fixed-main-content");
        //             callback(null, true);
        //         }, loadNotification: [ "loadingStart", function( callback, result ) {
        //             var option = {
        //                 config: {}, params: {
        //                     skip: 0,
        //                     limit: 20,
        //                     userOwner: $stateParams.id,
        //                     vendorOwner: $localStorage[ $localStorage.myApp ].retailerObj.id
        //                 }
        //             };
        //             vendorNotificationService.find(option).then(function( resp ) {
        //                 callback(null, resp);
        //             }).catch(function( error ) {
        //             });
        //         } ], updateNotifView: [ "loadNotification", function( callback, result ) {
        //             $scope.profileNotification = result.loadNotification;
        //             $scope.$apply();
        //         } ]
        //     }, function( error, results ) {
        //         loader.hide(".page-fixed-main-content");
        //     });
        //
        // };

} );