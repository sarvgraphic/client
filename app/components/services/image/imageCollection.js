myApp.provide.service('imageCollectionService', function( ioService ) {
    var resourceName = 'ImageCollection';
    return {
        get_top_featured: function( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/get_top_featured',
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
        

        get_featured: function( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/get_featured',
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

        'findCollections': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/findCollections',
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

        'findCollection': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/findCollection',
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
        },

        'saveImage': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'POST',
                    url: '/'+ resourceName + '/action/saveImage',
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

        'findImagesCollection': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/findImagesCollection',
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


        'deletedImage': function( params ) {
            return new Promise(function( resolve, reject ) {
                var theOption = {
                    method: 'DELETE',
                    url: '/'+ resourceName + '/action/deletedImage',
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
