myApp.controllerProvider.register('loginCtrl', 
    function( $scope,
              $localStorage,
              settings,
              $rootScope,
              $state,
              $timeout,
              $stateParams,
              $location,
              backendConfig,
              userService,
              loader
    ) {




        /**
         * check isLogin
         * @type {db}
         */
        userService.validateUser("backend", $localStorage.sscCurrentPath, "beforeLogin", "root");


        $scope.localStorageAddress = $localStorage[ $localStorage.sscCurrentPath ];


        $scope.date = new Date().getTime();





        // validation
        $scope.isRequired = function( val ) {
            return !validate.isEmpty(val);
        };

        $scope.hasMinLength = function( val ) {
            var constraints = {
                from: {
                    length: {
                        minimum: 8
                    }
                }
            };
            return !validate({ from: val }, constraints);
        };

        $scope.loginFields = {
            "identifier": "", 
            "password": ""
        };
        

        $scope.rememberMeChange = function() {
            $scope.localStorageAddress.rememberMe = $scope.rememberMe;
        };






        /* fill remember me stuff */
        $scope.avatarImg = false;
        $scope.adminPanelTitle = $localStorage.sscCurrentPath;
        if( $localStorage.sscCurrentPath && $scope.localStorageAddress.identifier && $scope.localStorageAddress.password && $scope.localStorageAddress.rememberMe != undefined ) {
            if($scope.localStorageAddress.UserBeforeLoginId){
                $scope.userBeforeLoginId = $scope.localStorageAddress.UserBeforeLoginId;
                $scope.avatarImg = true;
            }
            $scope.loginFields.identifier = $scope.localStorageAddress.identifier;
            $scope.loginFields.password = $scope.localStorageAddress.password;
            $scope.rememberMe = $scope.localStorageAddress.rememberMe;
        }else{
            $scope.avatarImg = true;
        }
        if( $localStorage.sscCurrentPath && $scope.localStorageAddress.rememberMe ) {
            $timeout(function() {
                $("#rememberMeInput").closest("span").addClass("checked");
            }, 10);
        }



        $scope.loginUserWithEnter = function (event) {
            // console.log("event :: ", event);
            if(event.keyCode == 13 && $scope.loginFields.identifier && $scope.loginFields.password){
                event.preventDefault();
                event.stopPropagation();
                $scope.login();
            }
        };








        $scope.login = function() {
            async.auto({
                startLoading: function( callback ) {

                    if(!$localStorage.sscCurrentPath){
                        $localStorage.sscCurrentPath = "scc-backend";

                        if(!$localStorage[$localStorage.sscCurrentPath]){
                            $localStorage[$localStorage.sscCurrentPath] = {};
                        }
                    }

                    loader.show(".viewLoading");
                    callback(null, true);
                },
                loginUser: [ 'startLoading', function( callback, result ) {
                    var option = {
                        scope : "backend",
                        data : {
                            identifier : $scope.loginFields.identifier,
                            password : $scope.loginFields.password
                        }
                    };

                    console.log("option : ", option );
                    userService.login(option).then(function( userLoginData ) {
                        console.log("data : ", userLoginData );
                        callback(null, userLoginData);
                    }).catch(function( error ) {
                        console.log("error : ", error );
                        callback(error);
                    });

                } ],
                updateUserStorage: [ 'loginUser', function( callback, result ) {

                    if( result.loginUser.result ) {

                        if( $scope.rememberMe ) {
                            $scope.localStorageAddress.identifier = $scope.loginFields.identifier;
                            $scope.localStorageAddress.password = $scope.loginFields.password;
                            $scope.localStorageAddress.UserBeforeLoginId = result.loginUser.data.id;
                            $scope.localStorageAddress.rememberMe = true;
                        } else {
                            $scope.localStorageAddress.identifier = "";
                            $scope.localStorageAddress.password = "";
                            $scope.localStorageAddress.rememberMe = false;
                            delete $scope.localStorageAddress.UserBeforeLoginId;
                        }


                        $scope.localStorageAddress.isLogin = true;
                        $scope.localStorageAddress.token = result.loginUser.data.token;
                        $scope.localStorageAddress.userObject = result.loginUser.data;

                        callback(null, true);
                    } else {
                        callback(null, result.loginUser.message);
                    }
                } ]
            }, function( err, results ) {

                if( err || !results.loginUser.result ) {
                    toastr.error(results.updateUserStorage || "Unknown error", "", {timeOut: 3000});
                } else {
                    $state.go("root.dashboard");
                }

                loader.hide(".viewLoading");
            });
        };
    } );

