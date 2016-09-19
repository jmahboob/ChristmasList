angular.module('ChristmasList',

    ['smart-table',
    'ui.bootstrap',
    'ngAnimate'])

    .controller('mainCtrl', ['$scope', '$log', '$uibModal',
        function (

            $scope,
            $log,
            $uibModal) {

            $log.debug("Initializing Controller");

            $scope.rowCollection = [
                {firstName: 'Jim', lastName: 'Jimmison'},
                {firstName: 'Tom', lastName: 'Tomlinson'},
                {firstName: 'Joe', lastName: 'Joelson'}
            ];

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
