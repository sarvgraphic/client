
var myApp = angular.module('myApp',
    [
        'ui.router',
        'angularCSS',
        'ngSanitize',
        'ngAnimate',
        'ui.bootstrap',
        'wu.masonry' ,
        'ngStorage',
        'ui.validate',
        'toggle-switch'
    ]);


/**
 * Setup global settings
 */



myApp.factory('settings', function($rootScope) {
    var settings = {
        delayTypeTime: 250,
        findLimit : 1000000,
        path : {}
    };
    settings.path.pathApp = window.myHost + ':' + window.myPort;
    settings.path.pathAppApi = settings.path.pathApp + window.serviceAddress;
    settings.path.pathAppUploadAvatar = settings.path.pathAppApi + '/users/';
    settings.path.pathUserAvatar = settings.path.pathAppApi + '/users/action/avatar/';
    settings.path.defaultUserAvatar = '/app/resource/images/default-user-avatar.png';

    settings.path.pathAppUploadImgCover = settings.path.pathAppApi + '/imageCollection/';
    $rootScope.settings = settings;

    return settings;
});


myApp.config(function($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide)
{

    myApp.controllerProvider = $controllerProvider;
    myApp.compileProvider    = $compileProvider;
    myApp.stateProvider      = $stateProvider;
    myApp.filterProvider     = $filterProvider;
    myApp.provide            = $provide;


    $urlRouterProvider.otherwise("/404");

    $stateProvider
        .state("noUrl", {
            url: "/",
            views : {
                "body@" : {
                    controller : function($state){
                        $state.go("root.home");
                    }
                }
            }
        })
        .state('root', {
            url: "",
            css: appIncludeFilesJson[appEnvironment].pages.root.css,
            views : {
                "header" : {
                    templateUrl : '/app/frontend/default/views/tpl/header/header.html',
                    controller : 'headerController'
                },
                "footer" : {
                    templateUrl : '/app/frontend/default/views/tpl/footer/footer.html',
                    controller : 'footerController'
                }
            },
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.root.js;
                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })
        .state('root.home', {
            url: "/home",
            views : {
                "body@" : {
                    templateUrl: "views/pages/home/home.html",
                    controller: "HomeCtrl"
                },
                "menu@" : {
                    templateUrl: "views/pages/home/menu/menu.html",
                    controller: function(){
                    }
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.home.css,
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.home.js;

                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })


        .state('root.photos', {
            url: "/photos",
            views : {
                "body@" : {
                    templateUrl: "views/pages/photos/photos.html",
                    controller: "PhotosCtrl"
                },
                "header@" : {
                    templateUrl : '/app/frontend/default/views/tpl/header/headerOther.html',
                    controller : 'headerController'
                },
                "menu@" : {
                    templateUrl: "views/pages/home/menu/menu.html",
                    controller: function(){
                        console.log("**** Home Menu Controller ****")
                    }
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.photos.css,
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.photos.js;

                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })

        .state('root.vectors', {
            url: "/vectors",
            views : {
                "body@" : {
                    templateUrl: "views/pages/vectors/vectors.html",
                    controller: "VectorsCtrl"
                },
                "header@" : {
                    templateUrl : '/app/frontend/default/views/tpl/header/headerOther.html',
                    controller : 'headerController'
                },
                "menu@" : {
                    templateUrl: "views/pages/home/menu/menu.html",
                    controller: function(){
                        console.log("**** Home Menu Controller ****")
                    }
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.vectors.css,
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.vectors.js;

                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })

        .state('root.search', {
            url: "/search/:searchData",
            views : {
                "body@" : {
                    templateUrl: "views/pages/search/search.html",
                    controller: "SearchCtrl"
                },
                "header@" : {
                    templateUrl : '/app/frontend/default/views/tpl/header/headerOther.html',
                    controller : 'headerController'
                },
                "menu@" : {
                    templateUrl: "views/pages/home/menu/menu.html",
                    controller: function(){
                        console.log("**** Home Menu Controller ****")
                    }
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.search.css,
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.search.js;

                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })


        .state('root.detail', {
            url: "/photo/:id",
            views : {
                "body@" : {
                    templateUrl: "views/pages/detail/detail.html",
                    controller: "DetailCtrl"
                },
                "header@" : {
                    templateUrl : '/app/frontend/default/views/tpl/header/headerOther.html',
                    controller : 'headerController'
                },
                "menu@" : {
                    templateUrl: "views/pages/home/menu/menu.html",
                    controller: function(){
                        console.log("**** Home Menu Controller ****")
                    }
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.detail.css,
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.detail.js;

                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })


        .state('notFound', {
            url: "/404",
            views : {
                "body" : {
                    templateUrl: "views/pages/404/404.html",
                    controller: "NotFoundCtrl"
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.notFound.css,
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.notFound.js;

                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })
        .state('root.signUp', {
            url: "/signUp",
            views : {
                "body@" : {
                    templateUrl: "views/pages/sign-up/sign-up.html",
                    controller: "SignUpCtrl"
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.signUp.css,
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.signUp.js;

                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })
        .state('root.signUpSingle', {
            url: "/signUpFree",
            views : {
                "body@" : {
                    templateUrl: "views/pages/sign-up/sign-up-free/view.html",
                    controller: "SignUpSingleCtrl"
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.signUpSingle.css,
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.signUpSingle.js;

                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })

        .state('root.subscribeImageFreeAccount', {
            url: "/subscribe-image/free-account",
            views: {
                "body@": {
                    templateUrl: "views/pages/subscribe/image/free-account/view.html",
                    controller: "subscribeImageFreeAccountCtrl"
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.subscribeImageFreeAccount.css,
            resolve: {
                deps: function ($q, $rootScope) {
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.subscribeImageFreeAccount.js;
                    $script(dependencies, function () {
                        $rootScope.$apply(function () {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })

        .state('root.subscribe', {
            url: "/subscribe",
            views : {
                "body@" : {
                    templateUrl: "views/pages/subscribe/subscribe.html",
                    controller: "SubscribeCtrl"
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.subscribe.css,
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.subscribe.js;
                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })
        .state('root.subscribeImagePlans', {
            url: "/subscribe-image/plans",
            views : {
                "body@" : {
                    templateUrl: "views/pages/subscribe/image/plans/view.html",
                    controller: "subscribeImagePlansCtrl"
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.subscribeImagePlans.css,
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.subscribeImagePlans.js;

                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })
        .state('root.forgotPassword', {
            url: "/forgot-password",
            views : {
                "body@" : {
                    templateUrl: "views/pages/forgot-password/view.html",
                    controller: "forgotPasswordCtrl"
                }
            },
            css: appIncludeFilesJson[appEnvironment].pages.forgotPassword.css,
            resolve:
            {
                deps:function($q, $rootScope){
                    var deferred = $q.defer();
                    var dependencies = appIncludeFilesJson[appEnvironment].pages.forgotPassword.js;
                    $script(dependencies, function()
                    {
                        $rootScope.$apply(function()
                        {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }
            }
        })
    $urlRouterProvider.deferIntercept();
});

/* Init global settings and run the app */
myApp.run([ "$rootScope", "$state", "$stateParams", "$urlRouter", "$location", function( $rootScope, $state, $stateParams, $urlRouter, $location ) {





    $rootScope.$on('$locationChangeSuccess', function( e, newUrl, oldUrl ) {
        console.log("e, newUrl, oldUrl : ", e, newUrl, oldUrl)

        e.preventDefault();
        //util.exitState();

        /**
         * provide conditions on when to
         * sync change in $location.path() with state reload.
         * I use $location and $state as examples, but
         * You can do any logic
         * before syncing OR stop syncing all together.
         */

        var reloaded = 'yes';


        console.log("$location.path() : ", $location.path());

        if( $location.path().slice(0, 8) == "/search/" && $rootScope.stateSearch == 'filter' ) {
            reloaded = "no";
        }

        if( (reloaded == "yes" || reloaded == undefined ) ) {
            $urlRouter.sync();
        } else {
            window.histoyOfUrl = "back";
        }

    });
    $urlRouter.listen();
} ]);
//
//myApp.run(function(){
//    var localDB = new db('website', 'public');
//    localDB.create();
//});

