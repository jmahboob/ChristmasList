angular.module('ChristmasList',

    ['smart-table',
    'ui.bootstrap',
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
    'ngRoute'])

    .controller('mainCtrl', ['$timeout', '$scope', '$log', '$uibModal', '$mdDialog', '$mdSidenav', '$http',
        function (

            $timeout,
            $scope,
            $log,
            $uibModal,
            $mdDialog,
            $mdSidenav,
            $http) {

            $scope.currentNavItem = 'myList';
            $scope.item = {firstName: "Null", lastName: "Nulleson"};

            $log.debug("Initializing Controller");

            $scope.rowCollection = [
                {firstName: 'Jim', lastName: 'Jimmison'},
                {firstName: 'Tom', lastName: 'Tomlinson'},
                {firstName: 'Joe', lastName: 'Joelson'}
            ];

            $scope.mylist = '';
            $scope.loadlist = function() {
                $http.get("mylist/loadlist").then(function(response) {
                    $scope.mylist = response.data;
                });
            };
            $scope.loadlist();

            $scope.accessMyList = function() {
                window.location = "/mylist";
            }

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

            $scope.goHome = function() {
                window.location = "/";
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

            $scope.toggleMenu = buildMenu();

            function buildMenu() {
                return function() {
                    $mdSidenav('menu')
                        .toggle()
                        .then(function() {
                            $log.debug("Menu toggled");
                        });
                }
            }
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

.controller('Menu', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.closeMenu = function() {
        $mdSidenav('menu').close()
            .then(function() {
                $log.debug("Menu closed");
            });
    };
})

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
})

.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});
