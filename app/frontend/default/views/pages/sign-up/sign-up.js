
myApp.controllerProvider.register('SignUpCtrl', function($scope, userService, settings, $timeout, $state) {

$timeout(function(){
    var slider = $('.c-layout-revo-slider .tp-banner');
    var cont = $('.c-layout-revo-slider .tp-banner-container');
    var api = slider.show().revolution(
        {
            delay: 2000,
            startwidth: 1170,
            startheight: 620,
            navigationType: "hide",
            navigationArrows: "solo",
            touchenabled: "on",
            onHoverStop: "on",
            keyboardNavigation: "off",
            navigationStyle: "circle",
            navigationHAlign: "center",
            navigationVAlign: "bottom",
            spinner: "spinner2",
            fullScreen: "on",
            fullScreenAlignForce: "on",
            fullScreenOffsetContainer: '',
            shadow: 0,
            fullWidth: "off",
            forceFullWidth: "off",
            hideTimerBar: "on",
            hideThumbsOnMobile: "on",
            hideNavDelayOnMobile: 1500,
            hideBulletsOnMobile: "on",
            hideArrowsOnMobile: "on",
            hideThumbsUnderResolution: 0
        });
    api.bind("revolution.slide.onchange", function(e, data)
    {
        $('.c-layout-header').removeClass('hide');
        setTimeout(function()
        {
            $('.c-singup-form').fadeIn();
        }, 1500);
    });
}, 1000);
   

    $scope.delayTypeTime = settings.delayTypeTime;
    // $scope.signUpFields = {
    //     phoneList: [
    //         {
    //             title: "cellphone",
    //             number: "",
    //             default: true
    //         },
    //         {
    //             title: "phone",
    //             number: "",
    //             default: false
    //         },
    //         {
    //             title: "fax",
    //             number: "",
    //             default: false
    //         }
    //     ],
    //     addressList: [
    //         {
    //             title: "default",
    //             address: "",
    //             zip: "",
    //             city: "",
    //             country: "",
    //             county: "",
    //             state: "",
    //             default: true
    //         }
    //     ]
    // };
    $scope.isRequired = function( val ) {
        // if(val != undefined){
            return !validate.isEmpty(val);
        // } else {
        //     return true;
        // }
    };
    // $scope.userNameExist = function( val ) {
    //     return new Promise(function(resolve, reject){
    //         if(val != undefined){
    //             var option = {
    //                 data: {
    //                     username : val
    //                 }
    //             };
    //             userService.existUserName(option).then(function(resp){
    //                 if(resp.result){
    //                     resolve(true);
    //                 } else {
    //                     reject(false);
    //                 }
    //             }).catch(function(){
    //                 reject(false);
    //             });
    //         } else {
    //             resolve(true);
    //         }
    //     });
    // };
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
    $scope.hasMinLength = function( val ) {
        var constraints = {
            from: {
                length: {
                    minimum: 6
                }
            }
        };
        return !validate({ from: val }, constraints);
    };
    // $scope.confirmPass = function( confirmPasswordValue ) {
    //     var constraints = {
    //         confirmPassword: {
    //             equality: "password"
    //         }
    //     };
    //     return !validate({
    //         password: $scope.signUpFields.password, confirmPassword: confirmPasswordValue
    //     }, constraints);
    // };
    $scope.isEmail = function( emailValue ) {
        var constraints = {
            from: {
                email: true
            }
        };
        return !validate({ from: emailValue }, constraints);
    };
    // localforage.setItem('name', 'srh').then(function(value){
    //     console.log("value", value);
    // }).catch(function(err){
    //     console.log("err", err);
    // });
    // localforage.getItem('name.first').then(function(value){
    //     console.log("get", value);
    // }).catch(function(err){
    //
    // });
    // console.log("localforage", localforage);
    $scope.signUpSingle = function(){
        $state.go("root.signUpSingle", { "reload": true });
    };
    $scope.signUpTeam = function(){

    };
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
                localforage.setItem('ssc-website', {
                    user: {
                        userObj: result.createUser.user,
                        isLogin: true,
                        token: result.createUser.token
                    }
                }).then(function(value){
                    console.log("value====>", value);
                    cb(null, value);
                });
            } ]
        }, function( err, results ) {

        });
    };

});