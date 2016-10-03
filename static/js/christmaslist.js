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

            $scope.mypurchases = '';
            $scope.loadpurchases = function() {
                $http.get("mypurchases/loadpurchases").then(function(response) {
                    $scope.mypurchases = response.data;
                });
            };
            $scope.loadpurchases();

            $scope.myideas = '';
            $scope.loadideas = function() {
                $http.get("myideas/loadideas").then(function(response) {
                    $scope.myideas = response.data;
                });
            };
            $scope.loadideas();


            $scope.accessMyList = function() {
                window.location = "/mylist";
            };

            $scope.accessMyIdeas = function() {
                window.location = "/myideas";
            };

            $scope.accessMyPurchases = function() {
                window.location = "/mypurchases";
            };

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
                    // Were passing the parent (root) scope in, this seems necessary in order to grab elements and call a function with them
                    scope: $scope,
                    // If we forget to preserve said scope then it gets destroyed when the dialog is dismissed and the entire application becomes non-responsive (essentially breaking it)
                    preserveScope: true,
                    targetEvent: ev,
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                });
            };

            $scope.addPurchase = function(ev) {
                $mdDialog.show({
                    controller: AddPurchaseController,
                    templateUrl: 'create/purchase',
                    scope: $scope,
                    preserveScope: true,
                    targetEvent: ev,
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                });
            };

            $scope.addIdea = function(ev) {
                $mdDialog.show({
                    controller: AddIdeaController,
                    templateUrl: 'create/idea',
                    scope: $scope,
                    preserveScope: true,
                    targetEvent: ev,
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                });
            };

            $scope.checkSidenav = function() {
                return $mdSidenav('menu').isOpen();
            }

            function AddWishController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $log.debug("Add Wish Controller - Cancelled");
                    $mdDialog.cancel();
                };

                $scope.answer = function(answer) {
                    $log.debug("Adding Wish - " + answer);
                    var headers = {'Content-Type': 'application/json'};
                    var answer_json = {};
                    answer_json.name = answer[0];
                    answer_json.cost = answer[1];
                    answer_json.url = answer[2];
                    answer_json.description = answer[3];
                    $http.post("create/wish", JSON.stringify(answer_json), headers)
                        .success(function(data, status, headers, config) {
                            $log.debug("Added Wish");
                        })
                        .error(function(data, status, headers, config) {
                            $log.debug("Error adding Wish");
                        });
                    $mdDialog.hide(answer);
                };
            };

            function AddPurchaseController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $log.debug("Add Purchase Controller - Cancelled");
                    $mdDialog.cancel();
                };

                $scope.answer = function(answer) {
                    $log.debug("Adding Purchase - " + answer);
                    var headers = {'Content-Type': 'application/json'};
                    var answer_json = {};
                    answer_json.name = answer[0];
                    answer_json.url = answer[1];
                    answer_json.description = answer[2];
                    $http.post("create/purchase", JSON.stringify(answer_json), headers)
                        .success(function(data, status, headers, config) {
                            $log.debug("Added Purchase");
                        })
                        .error(function(data, status, headers, config) {
                            $log.debug("Error adding Purchase");
                        })
                    $mdDialog.hide(answer);
                };
            }

            function AddIdeaController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $log.debug("Add Idea Controller - Cancelled");
                    $mdDialog.cancel();
                };

                $scope.answer = function(answer) {
                    $log.debug("Adding Idea - " + answer);
                    var headers = {'Content-Type': 'application/json'};
                    var answer_json = {};
                    answer_json.name = answer[0];
                    answer_json.url = answer[1];
                    answer_json.description = answer[2];
                    $http.post("create/idea", JSON.stringify(answer_json), headers)
                        .success(function(data, status, headers, config) {
                            $log.debug("Added Idea");
                        })
                        .error(function(data, status, headers, config) {
                            $log.debug("Error adding Idea");
                        })
                    $mdDialog.hide(answer);
                };
            }

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
