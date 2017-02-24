myApp.provide.service('imageSearchService', function( ioService ) {
    var resourceName = 'ImageSearch';
    return {
        get_top_hits_image_search: function( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/get_top_hits_image_search',
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
        get_top_editorial_choose_image: function( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/get_top_editorial_choose_image',
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
        get_top_editorial_choose: function( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/get_top_editorial_choose',
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
        }
    };
});
