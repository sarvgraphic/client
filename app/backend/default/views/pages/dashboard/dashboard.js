
myApp.controllerProvider.register('DashboardCtrl', function( $scope, $rootScope, userService, $localStorage ) {

    // var localDB = new db('backend', 'public');
    // localDB.create();
    // localDB.get("isLogin").then(function (resp) {
    //     $rootScope.isLogin = resp;
    //     $scope.$apply();
    // });
    /**
     * check isLogin
     * @type {db}
     */
    userService.validateUser("backend", $localStorage.sscCurrentPath, "afterLogin", "root");
    
});