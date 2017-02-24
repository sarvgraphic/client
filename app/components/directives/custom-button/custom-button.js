myApp.compileProvider.directive('customButton', function() {
    return {
        restrict: 'E', scope: {
            disabledCondition: "=",
            clickMethod: "&",
            buttonType: "@",
            className: "@",
            iconClass: "@",
            iconSide: "@",
            url: "@",
            confirm: "=",
            title: "@",
            stateName: "@"
        }, templateUrl: function( elm, attr ) {
            return "/app/components/directives/custom-button/custom-button.html";
        }, controller: function( $rootScope, $scope ) {

            /**
             * handle ng-click
             */
            $scope.clickEl = function() {
                $scope.clickMethod();
            };

            /**
             * handle <a> or <button>
             */
            if( $scope.url != undefined && $scope.url != "" ) {
                $scope.stateName = "";
                $scope.disabledCondition = undefined;
                $scope.elementType = false;
            }

            if( $scope.disabledCondition != undefined || $scope.url == undefined || $scope.url == "" ) {
                $scope.elementType = true;
            } else {
                $scope.elementType = false;
            }

            /**
             * handle ng-disable
             */
            if( $scope.disabledCondition != undefined ) {
                $scope.disableClass = "disableBtn";
            } else {
                $scope.disableClass = "";
            }

            $scope.$watch("disabledCondition", function( newValue, oldValue ) {
                if( newValue == false ) {
                    angular.element(".disableBtn").removeAttr("disabled");
                } else {
                    angular.element(".disableBtn").attr("disabled", "disabled");
                }
            });

            if ($scope.stateName == undefined || $scope.stateName == "") {
                $scope.srefCondition = false;
            }else{
                $scope.srefCondition = true;
            }

        }
    };
});