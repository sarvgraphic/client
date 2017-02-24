myApp.provide.service('imageTagService', function( ioService ) {
    var resourceName = 'ImageTag';
    return {
        get_top_image_tag: function( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/get_top_image_tag',
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                console.log("theOption : ", theOption)
                ioService.request(theOption).then(function(response) {
                    resolve( response.data );
                }).catch(function(err){
                    reject( err );
                });
            });
        },

        'findTags': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/findTags',
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

        'exist': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'POST',
                    url: '/'+ resourceName + '/action/exist',
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

        'create': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'POST',
                    url: '/'+ resourceName + '/action/create',
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

        'destroy': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'DELETE',
                    url: '/'+ resourceName + '/action/destroy',
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

        'findImageTag': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/findImageTag',
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

        'update': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'POST',
                    url: '/'+ resourceName + '/action/update',
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
        }
    };
});
