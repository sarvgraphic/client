"use strict";
/***
 Metronic AngularJS App Main Script
 ***/



/* Metronic App */

var myApp = angular.module('myApp', [ 'ui.router', 'ui.bootstrap', 'angularCSS', 'ui.bootstrap.tpls', 'ngSanitize', 'ngStorage', 'ui.validate', 'toggle-switch', 'ngFileUpload','wu.masonry', 'ui.select', 'ngSanitize' ]);


myApp.filter('propsFilter', function() {
    return function(items, props) {
        $('[id*="ui-select-choices"] [ng-mouseenter]').off('mouseenter');
        var out = [];
        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop] && item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/
/**
 `$controller` will no longer look for controllers on `window`.
 The old behavior of looking on `window` for controllers was originally intended
 for use in examples, demos, and toy apps. We found that allowing global controller
 functions encouraged poor practices, so we resolved to disable this behavior by
 default.

 To migrate, register your controllers with modules rather than exposing them
 as globals:

 Before:

 ```javascript
 function MyController() {
  // ...
}
 ```

 After:

 ```javascript
 angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

 Although it's not recommended, you can re-enable the old behavior like this:

 ```javascript
 angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
 **/
// myApp.run(function( editableOptions ) {
//     editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
// });

//AngularJS v1.3.x workaround for old style controller declarition in HTML
myApp.config([ '$controllerProvider', function( $controllerProvider ) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
} ]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
myApp.factory('settings', [ '$rootScope', '$localStorage', function( $rootScope, $localStorage ) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        findWhereLimit: 1000000,
        delayToastrTime : 3000,
        deleteBoxTitle: 'Delete',
        deleteBoxContent: 'Are you sure you want to delete this record?',
        deleteBoxYesBtn: 'Yes, Delete',
        deleteBoxNoBtn: 'No, Cancel',
        deleteBulkBoxTitle: 'Delete',
        deleteBulkBoxContent: 'Are you sure you want to delete all of selected records?',
        deleteBulkBoxYesBtn: 'Yes, Delete',
        deleteBulkBoxNoBtn: 'No, Cancel',
        delayTypeTime: 250,
        path: {
            pathApp: '',
            pathAppApi: '',
            pathAppUploadAvatar: '',
            pathUserAvatar: '',
            defaultUserAvatar: ''
        }
    };
    $rootScope.settings = settings;

    return settings;
} ]);


/* Setup App Main Controller */
myApp.controller('AppController', [ '$scope', '$rootScope', 'settings', '$location', '$state', '$q', '$localStorage', function( $scope, $rootScope, settings, $location, $state, $q, $localStorage ) {

    settings.path.pathApp = window.myHost + ':' + window.myPort;
    settings.path.pathAppApi = settings.path.pathApp + window.serviceAddress;
    settings.path.pathAppUploadAvatar = settings.path.pathAppApi + '/users/';
    settings.path.pathUserAvatar = settings.path.pathAppApi + '/users/action/avatar/';
    settings.path.defaultUserAvatar = '/app/resource/images/default-user-avatar.png';

    settings.path.pathAppUploadImgCover = settings.path.pathAppApi + '/imageCollection/';

} ]);

myApp.directive('imageonload', [ '$parse', function( $parse ) {
    return {
        restrict: 'A',

        link: function( scope, elem, attrs ) {
            var fn = $parse(attrs.sbLoad);

            elem.on('load', function( event ) {

                scope.$apply(function() {
                    fn(scope, { $event: event });
                });
            });
        }
    };
} ]);

/* Setup Routing For All Pages */
myApp.config([ '$urlRouterProvider', '$stateProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide','$uibTooltipProvider',
    function( $urlRouterProvider, $stateProvider, $controllerProvider, $compileProvider, $filterProvider, $provide ,$uibTooltipProvider) {

        myApp.controllerProvider = $controllerProvider;
        myApp.compileProvider    = $compileProvider;
        myApp.stateProvider      = $stateProvider;
        myApp.filterProvider     = $filterProvider;
        myApp.provide            = $provide;
        $uibTooltipProvider.options({placement: 'top', trigger: 'mouseenter'});

        $stateProvider
            .state('root.defaultPage', {
                url: "/",
                controller: function ($state) {
                    $state.go("root.login");
                }
            })
            .state('vendorError404', {
                url: "/404",
                controller: "DefaultCtrl",
                templateUrl: 'views/pages/404/404.html',
                css: appIncludeFilesJson[appEnvironment].pages.vendorError404.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.vendorError404.js;

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
            .state('root', {
                url: "",
                css: appIncludeFilesJson[appEnvironment].pages.root.css,
                views : {
                    // "header" : {
                    //     templateUrl : '/app/b2b/frontend/lr-resources/default/views/tpl/header/header.html',
                    //     controller : 'headerController'
                    // },
                    // "footer" : {
                    //     templateUrl : '/app/b2b/frontend/lr-resources/default/views/tpl/footer/footer.html',
                    //     controller : 'footerController'
                    // },
                    "body" : {
                        template: '<div ng-include="getTemplateUrl()"></div>',
                        controller: 'RootController'
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

            .state('root.login', {
                url: "/login",
                templateUrl: "views/pages/user/login/login.html",
                controller: 'loginCtrl',
                data: { pageTitle: 'Login' },
                css: appIncludeFilesJson[appEnvironment].pages.login.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.login.js;

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

            .state('root.dashboard', {
                url: "/dashboard",
                templateUrl: "views/pages/dashboard/dashboard.html",
                controller: 'DashboardCtrl',
                data: { pageTitle: 'Dashboard' },
                css: appIncludeFilesJson[appEnvironment].pages.dashboard.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.dashboard.js;

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

            .state('root.userList', {
                url: "/user/list",
                templateUrl: "views/pages/user/user-management/list/list.html",
                data: { pageTitle: 'User' },
                controller: "UserListCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.userList.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.userList.js;

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

            .state('root.userAdd', {
                url: "/user/add",
                templateUrl: "views/pages/user/user-management/add/add.html",
                data: { pageTitle: 'User' },
                controller: "UserAddCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.userAdd.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.userAdd.js;

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

            .state('root.userEdit', {
                url: "/user/edit/:userId",
                templateUrl: "views/pages/user/user-management/edit/edit.html",
                data: { pageTitle: 'User' },
                controller: "UserEditCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.userEdit.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.userEdit.js;

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

            .state('root.profile', {
                url: "/profile/:userId",
                templateUrl: "views/pages/user/profile/view/view.html",
                data: { pageTitle: 'Profile' },
                controller: "ProfileCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.profile.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.profile.js;

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

            .state('root.editProfile', {
                url: "/profile/edit/:userId",
                templateUrl: "views/pages/user/profile/edit/edit.html",
                data: { pageTitle: 'Profile' },
                controller: "EditProfileCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.editProfile.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.editProfile.js;

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

            .state('root.imageCollectionList', {
                url: "/image-collection/list",
                templateUrl: "views/pages/image-collection/list/list.html",
                data: { pageTitle: 'Collection' },
                controller: "ImageCollectionListCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageCollectionList.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageCollectionList.js;
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
                
            .state('root.imageCategoryList', {
                url: "/category/list",
                templateUrl: "views/pages/image-category/list/list.html",
                data: { pageTitle: 'Image Category' },
                controller: "ImageCategoryListCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageCategoryList.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageCategoryList.js;
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

            .state('root.imageCollectionAdd', {
                url: "/image-collection/add",
                templateUrl: "views/pages/image-collection/add/add.html",
                data: { pageTitle: 'Collection' },
                controller: "ImageCollectionAddCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageCollectionAdd.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageCollectionAdd.js;
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

            .state('root.imageCollectionEdit', {
                url: "/image-collection/edit/:imgCollectionId",
                templateUrl: "views/pages/image-collection/edit/edit.html",
                data: { pageTitle: 'Collection' },
                controller: "ImageCollectionEditCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageCollectionEdit.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageCollectionEdit.js;
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

            .state('root.imageCollectionImage', {
                url: "/image-collection/image/:imgCollectionId/:imgCollectionTitle",
                templateUrl: "views/pages/image-collection/image/image.html",
                data: { pageTitle: 'Collection' },
                controller: "ImageCollectionImageCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageCollectionImage.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageCollectionImage.js;
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
            
            .state('root.imageCategoryAdd', {
                url: "/category/add",
                templateUrl: "views/pages/image-category/add/add.html",
                data: { pageTitle: 'Image Category' },
                controller: "ImageCategoryAddCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageCategoryAdd.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageCategoryAdd.js;
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

            .state('root.imageCategoryEdit', {
                url: "/category/edit/:id",
                templateUrl: "views/pages/image-category/edit/edit.html",
                data: { pageTitle: 'Image Category' },
                controller: "ImageCategoryEditCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageCategoryEdit.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageCategoryEdit.js;
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

            .state('root.imageList', {
                url: "/image/list",
                templateUrl: "views/pages/image/list/list.html",
                data: { pageTitle: 'Image' },
                controller: "ImageListCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageList.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageList.js;

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

            .state('root.imageAdd', {
                url: "/image/add",
                templateUrl: "views/pages/image/add/add.html",
                data: { pageTitle: 'Image' },
                controller: "ImageAddCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageAdd.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageAdd.js;

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

            .state('root.imageEdit', {
                url: "/image/edit/:id",
                templateUrl: "views/pages/image/edit/edit.html",
                data: { pageTitle: 'Image' },
                controller: "ImageEditCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageEdit.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageEdit.js;

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

            .state('root.publisherList', {
                url: "/publisher/list",
                templateUrl: "views/pages/publisher/list/list.html",
                data: { pageTitle: 'Publisher' },
                controller: "PublisherListCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.publisherList.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.publisherList.js;

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

            .state('root.publisherAdd', {
                url: "/publisher/add",
                templateUrl: "views/pages/publisher/add/add.html",
                data: { pageTitle: 'Publisher' },
                controller: "PublisherAddCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.publisherAdd.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.publisherAdd.js;

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

            .state('root.publisherEdit', {
                url: "/publisher/edit/:id",
                templateUrl: "views/pages/publisher/edit/edit.html",
                data: { pageTitle: 'Publisher' },
                controller: "PublisherEditCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.publisherEdit.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.publisherEdit.js;

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

            .state('root.imageTagList', {
                url: "/image-tag/list",
                templateUrl: "views/pages/image-tag/list/list.html",
                data: { pageTitle: 'Image Tag' },
                controller: "ImageTagListCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageTagList.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageTagList.js;
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

            .state('root.imageTagAdd', {
                url: "/image-tag/add",
                templateUrl: "views/pages/image-tag/add/add.html",
                data: { pageTitle: 'Image Tag' },
                controller: "ImageTagAddCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageTagAdd.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageTagAdd.js;
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

            .state('root.imageTagEdit', {
                url: "/image-tag/edit/:imageTagID",
                templateUrl: "views/pages/image-tag/edit/edit.html",
                data: { pageTitle: 'Image Tag' },
                controller: "ImageTagEditCtrl",
                css: appIncludeFilesJson[appEnvironment].pages.imageTagEdit.css,
                resolve:
                {
                    deps:function($q, $rootScope){
                        var deferred = $q.defer();
                        var dependencies = appIncludeFilesJson[appEnvironment].pages.imageTagEdit.js;
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
        
            $urlRouterProvider.otherwise('/404');
    }
]);

myApp.controller("RootController", function( $rootScope, $scope, $stateParams, $location, $state, $localStorage, $q, settings ) {


    // $rootScope.$on("changeIsLogin", function () {
    //     $scope.$apply()
    // });
    $localStorage.sscCurrentPath = "scc-backend";
    $localStorage[ $localStorage.sscCurrentPath ] = $localStorage[ $localStorage.sscCurrentPath ] || {};

    $scope.getTemplateUrl = function(template) {
        /**
         * get template
         */
        if( $localStorage.sscCurrentPath && $localStorage[ $localStorage.sscCurrentPath ] && $localStorage[ $localStorage.sscCurrentPath ].isLogin ) {
            settings.currentTemplate = "afterLogin";
            return 'views/layout/after-login.html';
        } else {
            settings.currentTemplate = "beforeLogin";
            return 'views/layout/before-login.html';
        }

    };

    // if( $localStorage.sscCurrentPath && $localStorage[ $localStorage.sscCurrentPath ] && !$localStorage[ $localStorage.sscCurrentPath ].isLogin ) {
    //     if ($location.$$path.split("/").splice(1).length == 1) {
    //         $state.go('root.login');
    //     }
    // } else if ($location.$$path.split("/").splice(1).length == 1) {
    //     $state.go('root.dashboard');
    // }

});

/* Init global settings and run the app */
myApp.run([ '$rootScope', 'settings', '$state', '$stateParams', function( $rootScope, settings, $state, $stateParams ) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $rootScope.$stateParams = $stateParams;
    // $rootScope.$on('$stateChangeStart', function( event, toState, toParams, fromState, fromParams ) {
    //     util.exitState();
    // });
    
} ]);

myApp.factory('backendConfig', [ '$rootScope', '$stateParams', function( $rootScope, $stateParams ) {
    var config = {
        url: $stateParams.entityName
    };
    $rootScope.$on("changeVendorUrl", function( event, vendorNameFromEvent ) {
        config.url = vendorNameFromEvent;
    });
    return config;
} ]);
myApp.factory('loader', function() {
    return {
        show: function( element ) {
            element = element || "body";
            App.blockUI({
                target: $(element), animate: true, overlayColor: 'none'
            });
        }, hide: function( element ) {
            element = element || "body";
            App.unblockUI($(element));
        }
    };
});
