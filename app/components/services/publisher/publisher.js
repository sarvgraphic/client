myApp.provide.service('publisherService', function( ioService ) {
    var resourceName = 'publisher';
    return {
        
        'createPublisher': function( params ) {
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

        'getOnePublisher': function( params ) {
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

        'getAllPublisher': function( params ) {
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

        'destroyOnePublisher': function( params ) {
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

        'editOnePublisher': function( params ) {
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
        }
        
    };
});
