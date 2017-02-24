myApp.provide.service('imageOfWeekService', function( ioService ) {
    var resourceName = 'ImageOfWeek';
    return {
        get_image_of_week: function( params ) {
            return new Promise(function(resolve, reject){
                var theOption = {
                    method: 'GET',
                    url: '/'+ resourceName + '/action/get_image_of_week',
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
