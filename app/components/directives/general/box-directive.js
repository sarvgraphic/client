myApp.compileProvider.directive('boxDirective', function() {

    return {
        restrict: 'E',
        templateUrl: function() {
            return "/app/components/directives/general/views/box-template.html";
        },
        scope: {
            content: "=?",
            icon: "=?",
            background: "=?",
            link: "=?",
            button: "=?"
        }, 
        controller: function( $scope, $state, $stateParams ) {
            $scope.changeState = function() {
                $state.go($scope.link, { reload: true });
            };
            
            if( $scope.content ) {
                $scope.content = $scope.content;
            } else {
                $scope.content = "This is Empty";
            }
            if( $scope.icon ) {
                $scope.icon = $scope.icon;
            } else {
                $scope.icon = "notification.png";
            }
            if( $scope.background ) {
                $scope.background = $scope.background;
            } else {
                $scope.background = "bg-white bg-font-white";
            }
            if( $scope.link ) {
                $scope.link = $scope.link;
            } else if( $scope.url ) {
                $scope.url = $scope.url;
            } else {
                $scope.link = "dashboard";
            }

            if( $scope.button ) {
                $scope.showbutton = true;
                $scope.button = $scope.button;
            } else {
                $scope.showbutton = false;
            }

        }
    };
});