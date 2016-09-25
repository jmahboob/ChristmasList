angular.module('ChristmasList',

    ['smart-table',
    'ui.bootstrap',
    'ngAnimate',
    'ngMaterial',
    'ngMessages'])

    .controller('mainCtrl', ['$timeout', '$scope', '$log', '$uibModal',
        function (

            $timeout,
            $scope,
            $log,
            $uibModal) {

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

            $scope.addWish = function () {
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
            };
        }
    ])

    .controller('AddWishController', function ($uibModalInstance) {
        var $wish = this;

        $wish.ok = function () {
            $log.debug("Add Wish OK");
            $uibModalInstance.close('OK');
        };

        $wish.cancel = function () {
            $log.debug("Add Wish Cancel");
            $uibModalInstance.dismiss('Cancel');
        };
    });
