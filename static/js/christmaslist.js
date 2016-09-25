angular.module('ChristmasList',

    ['smart-table',
    'ui.bootstrap',
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
    'ngRoute'])

    .controller('mainCtrl', ['$timeout', '$scope', '$log', '$uibModal', '$mdDialog',
        function (

            $timeout,
            $scope,
            $log,
            $uibModal,
            $mdDialog) {

            $scope.currentNavItem = 'myList';
            $scope.item = {firstName: "Null", lastName: "Nulleson"};

            $log.debug("Initializing Controller");

            $scope.rowCollection = [
                {firstName: 'Jim', lastName: 'Jimmison'},
                {firstName: 'Tom', lastName: 'Tomlinson'},
                {firstName: 'Joe', lastName: 'Joelson'}
            ];

            $scope.loadSelection = function() {
                return $timeout(function() {
                    $scope.rowCollection = $scope.rowCollection;
                }, 656);
            }

            $scope.test = function() {
                $log.debug("Test Button Works");
            };

            $scope.redirectLogin = function() {
                window.location = "/login";
            }

            $scope.redirectLogout = function() {
                window.location = "/logout";
            }

            /*$scope.addWish = function () {
                $log.debug("Inside $wish.add");
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabeledBy: 'Add a Wish',
                    ariaDescribedBy: 'Add an item to your Christmas wish-list',
                    templateUrl: 'create/wish',
                    controller: 'AddWishController',
                    size: 'lg',
                    resolve: {}
                });
            };*/

            $scope.addWish = function(ev) {
                $mdDialog.show({
                    controller: AddWishController,
                    templateUrl: 'create/wish',
                    targetEvent: ev,
                    clickOutsideToClose: false,
                });
            };

            function AddWishController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.answer = function(item) {
                    $mdDialog.hide(item);
                };
            };
    }
])

/*.controller('AddWishController', function ($uibModalInstance, $scope, $mdDialog) {
    var $wish = this;

    $wish.ok = function () {
        $log.debug("Add Wish OK");
        $uibModalInstance.close('OK');
    };

    $wish.cancel = function () {
        $log.debug("Add Wish Cancel");
        $uibModalInstance.dismiss('Cancel');
    };
})*/

.config(function($routeProvider) {
    $routeProvider
        .when("/test", {
            templateUrl: "../../templates/test.html"
        })
        .when("/familyMembers", {
            templateUrl: "../../templates/familyMembers.html"
        })
        .when("/myList", {
            templateUrl: "../../templates/myList.html"
        });
});
