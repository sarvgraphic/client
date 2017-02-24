myApp.controllerProvider.register('BackendDefaultCtrl', function( $rootScope, $scope, $http, $timeout, $state, userService, $localStorage ) {
    $("body").removeClass();
    $("body").addClass("page-header-fixed page-sidebar-closed-hide-logo page-container-bg-solid page-sidebar-closed-hide-logo page-md");//page-on-load


    // var headerLocalDB = new db('backend', 'public');
    // headerLocalDB.create();
    // headerLocalDB.get("userObj").then(function (resp) {
    //     $scope.userObject = resp;
    //     $("#headerAvatar").append($compile('<user-avatar user-id="userObject.id" width="40" height="40"></user-avatar>')($scope))
    // });

    $scope.userObject = $localStorage[ $localStorage.sscCurrentPath ].userObject;

    $scope.$on('$includeContentLoaded', function() {
        // $scope.vendorUrlName = backendConfig.url;
        Layout.initHeader();
        // App.initUniform();
        $scope.logout = function() {

            async.auto({
                removeSocketId: function( callback ) {
                    var option = {
                        scope : "backend",
                        data : {
                            userId : $scope.userObject.id
                        }
                    };
                    console.log("logout option :: ", option)
                    userService.logout(option).then(function( result ) {
                        console.log("result :: ", result);
                        callback(null, true);
                    }).catch(function( error ) {
                        console.log("error :: ", error);
                        callback(null, false);
                    });
                }, removeStorage: [ 'removeSocketId', function( callback, result ) {
                    delete $localStorage[ $localStorage.sscCurrentPath ].userObject;
                    delete $localStorage[ $localStorage.sscCurrentPath ].token;
                    // headerLocalDB.remove('userObj');
                    // headerLocalDB.set('isLogin', false);
                    // headerLocalDB.remove('token');
                    callback(null, true);
                } ], changeState: [ 'removeStorage', function( callback, result ) {

                    $localStorage[ $localStorage.sscCurrentPath ].isLogin = false;
                    callback(null, true);

                } ]
            }, function( error, result ) {
                $state.go("root.login");
            });
        };
    });
    /**
     * Create Sidebar & Logics
     */
    setTimeout(function() {
        App.initComponents();
        Layout.initSidebar();

    }, 1000);

    /**
     * QuickSidebarController & Footer
     */
    setTimeout(function() {
        // init quick sidebar
        // init footer
        QuickSidebar.init();
        Layout.initFooter();
    }, 1000);


});
