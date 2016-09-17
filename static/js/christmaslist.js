angular.module('ChristmasList', ['smart-table'])
    .controller('mainCtrl', ['$scope',
        function ($scope) {
            $scope.rowCollection = [
                {firstName: 'Jim', lastName: 'Jimmison'},
                {firstName: 'Tom', lastName: 'Tomlinson'},
                {firstName: 'Joe', lastName: 'Joelson'}
            ];
        }
    ]);
