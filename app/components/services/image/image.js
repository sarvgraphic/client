myApp.provide.service('imageService', function( ioService ) {
    var resourceName = 'image';
    return {

        'get_search': function( params ) {
            console.log("params")
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/get_search',
                    data: params.data,
                    scope: params.scope,
                    headers: params.headers || {}
                };
                console.log("theOption : ", theOption)
                ioService.request(theOption).then(function(response) {
                    console.log("dddd : ", response)
                    resolve( response.data );
                }).catch(function(err){
                    reject( err );
                });
            });
        },
        
        'createImage': function( params ) {
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

        'getOneImage': function( params ) {
            console.log("params")
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/find_one',
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

        'getAllImage': function( params ) {
            console.log("params")
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/find',
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

        'destroyOneImage': function( params ) {
            console.log("params")
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'DELETE',
                    url: '/'+ resourceName + '/action/destroy/' + params.data.id,
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

        'editOneImage': function( params ) {
            console.log("params")
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'PUT',
                    url: '/'+ resourceName + '/action/update/' + params.data.id,
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

        'imageSelect': function( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'POST',
                    url: '/'+ resourceName + '/action/imageSelect',
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
        
    };
});
