myApp.provide.service('ioService', function($http) {
    return {
        'request': function(theOption) {
                theOption.url = window.apiUrl + theOption.url;
                theOption.headers.scope = theOption.scope || 'website';
                if(theOption.token){
                    theOption.headers['X-Access-Token'] = theOption.token;
                    theOption.headers.entityKey = theOption.entityKey;
                    delete theOption.token;
                    delete theOption.entityKey;
                }
                if(theOption.method.toLowerCase() == 'get'){
                    theOption.params = theOption.data;
                    delete theOption.data;
                }
            
                var scopeName = 'ssc-'+ (theOption.scope || 'website');

                // localforage.getItem(scopeName).then(function(value){
                //     if(value.user && value.user.token){
                //         theOption.headers.access_token = value.user.token;
                //     }
                // });
                // if($localStorage[scopeName] && $localStorage[scopeName]['user'] && $localStorage[scopeName]['user']['token']){
                //     theOption.headers.access_token = $localStorage[scopeName]['user']['token'];
                // }

                console.log(theOption)
                delete theOption.scope;
                return $http(theOption);
        }
    };
});
