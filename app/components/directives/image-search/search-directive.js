myApp.compileProvider.directive("searchDirective", function() {
    return {
        restrict: "E",
        templateUrl: '/app/components/directives/image-search/view/search-template.html',
        controller: 'searchDirectiveController'
    };
});
myApp.controllerProvider.register("searchDirectiveController", function( $scope, $location , $state, $rootScope) {
    $rootScope.stateSearch = 'noFilter';

    $scope.$on('searchDirectiveData', function(n, data){
        console.log("n, datassssss : ", n, data)
    })


    $scope.searchItem = '';
    $scope.setSearchParam = function(data){
        if(data == 'allImages'){
            $scope.searchParam = 'All Images';
        }else{
            $scope.searchParam = data;
        }



    };
    var searchDefault='';
    switch($state['current']['url'].substr(1)){

        case 'photos':
            searchDefault = 'Photo';
            break;
        case 'vectors' :
            searchDefault = 'Vector';
            break;
        default:
            searchDefault = 'allImages';
            break;
    }
    $scope.setSearchParam(searchDefault);

    console.log("$stateParams : ", $state['current']['url'].substr(1));
    $scope.search = function(){
        console.log("searchItem : ", $scope.searchItem)
        console.log("searchParam : ", $scope.searchParam, "#/search/"+$scope.searchItem)

        var urlData = {
            type : $scope.searchParam,
            query : $scope.searchItem
        };
        $location.path("/search/"+JSON.stringify(urlData))


    }
});