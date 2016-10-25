angular.module('ChristmasList',

    ['smart-table',
    'ui.bootstrap',
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
    'ngRoute',
    'md.data.table'])

    .controller('mainCtrl', ['$timeout', '$scope', '$log', '$uibModal', '$mdDialog', '$mdSidenav', '$http', '$mdTheming',
        function (

            $timeout,
            $scope,
            $log,
            $uibModal,
            $mdDialog,
            $mdSidenav,
            $http,
            $mdTheming) {

            $scope.currentNavItem = 'myList';
            $scope.item = {firstName: "Null", lastName: "Nulleson"};

            $scope.currentUser = {};
            $scope.getCurrentUser = function() {
                $log.debug("Getting current user");
                $http.get("get/currentuser").then(function(response) {
                    $scope.currentUser.name = response.data.name;
                    $scope.currentUser.id = response.data.id;
                });
            };
            $scope.getCurrentUser();

            $log.debug("Initializing Controller");

            $scope.fab_isOpen = false;
            $log.debug($scope.fab_isOpen);

            $scope.userID_CACHE = [];
            $scope.selected = [];
            $scope.loadUserIDs = function() {
                $http.get("get/user/all").then(function(response) {
                    $scope.userID_CACHE = response.data;
                    //$log.debug($scope.userID_CACHE);
                });
            }
            $scope.loadUserIDs();

            $scope.userID_TEST = [ {
                id: 0,
                first_name: 'Test1',
                last_name: 'Test2',
                email: 'TestEmail'
                }, {
                id: 1,
                first_name: 'Another1',
                last_name: 'Another2',
                email: 'AnotherEmail'
            }];

            $scope.nameFromID = function(id) {
                for(var i = 0; i < $scope.userID_CACHE.length; i++) {
                    //$log.debug($scope.userID_CACHE[i]);
                    if ($scope.userID_CACHE[i].id == id) {
                        return $scope.userID_CACHE[i].first_name + " " + $scope.userID_CACHE[i].last_name;
                    }
                }
                return "No User ID Found";
            };

            $scope.mylist = '';
            $scope.list = '';
            $scope.myItemCount = 0;
            $scope.myItemTotal = 0;
            $scope.loadlist = function() {
                $http.get("mylist/loadlist").then(function(response) {
                    $scope.mylist = response.data;
                    $scope.myItemCount= $scope.mylist.length;
                    for (i = 0; i < $scope.mylist.length; i++) {
                        $scope.myItemTotal += $scope.mylist[i].cost;
                    }
                });
                $http.get("list/loadlist").then(function(response) {
                    $scope.list = response.data;
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

            $scope.goList = function() {
                window.location = "/list";
            };

            $scope.accessMyTracking = function() {
                window.location = "/mytracking"
            }

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

            $scope.users = null;
            $scope.loadUsers = function() {
                $http.get("familyMembers/load").then(function(response) {
                    $scope.users = response.data;
                });
            };

            $scope.showPlaceholder = function(ev) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Button Broken :-(')
                        .textContent("The site is still under construction, so at the moment this button doesn't work.  I'll let everyone know when it does!")
                        .ariaLabel('Broken Button')
                        .ok('Got it!')
                        .targetEvent(ev)
                );
            };

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

            $scope.deleteWish = function(id) {
                $log.debug(id);
                var confirm = $mdDialog.confirm()
                    .title('Remove Wish')
                    .textContent('Are you sure you want to remove this wish?')
                    .ariaLabel('remove wish')
                    .ok('I don\'t want it.')
                    .cancel('No! Don\'t delete it!');

                $mdDialog.show(confirm).then(function() {
                    $http.delete('delete/wish/' + id.toString())
                        .then(function(resposnse) {
                            $log.debug('Deleted wish');
                            window.location.reload();
                        }, function(response) {
                            $log.debug('Error deleting wish');
                        });
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

            $scope.deleteIdea = function(id) {
                $log.debug(id);
                var confirm = $mdDialog.confirm()
                    .title('Remove Idea')
                    .textContent('Are you sure you want to remove this idea?')
                    .ariaLabel('remove idea')
                    .ok('Yup')
                    .cancel('No!');

                $mdDialog.show(confirm).then(function() {
                    $http.delete('delete/idea/' + id.toString())
                        .then(function(resposnse) {
                            $log.debug('Deleted idea');
                            window.location.reload();
                        }, function(response) {
                            $log.debug('Error deleting idea');
                        });
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
                            window.location.reload();
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
                $scope.selectedUserID = null;
                $scope.updateSelected = function(user) {
                    $scope.selectedUserID = user;
                };

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
                    answer_json.forperson = answer[3];
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

    $mdThemingProvider.theme('dark-green').backgroundPalette('green').dark();
    $mdThemingProvider.theme('dark-green').primaryPalette('green').dark();

    $mdThemingProvider.theme('offblue').backgroundPalette('light-blue').dark();
    $mdThemingProvider.theme('offblue').primaryPalette('deep-purple');
    /*$mdThemingProvider.enableBrowserColor({
        theme: 'dark-blue',
        palette: 'accent',
        hue: '200'
    });*/
});
