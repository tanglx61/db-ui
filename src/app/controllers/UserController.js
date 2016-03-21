(function() {
    'use strict';

    angular
        .module('app')
        .controller('UserController', [
            'apiService', '$scope', '$rootScope', '$mdDialog',
            UserController
        ]);

    function UserController(apiService, $scope, $rootScope, $mdDialog) {
        var vm = this;

        var page = 1;

        var currentUser;

        vm.users = [];

        var unbind = $rootScope.$on('userAdded', function() {

            refreshData();
        });

        $scope.$on('$destroy', unbind);

        function refreshData() {
            apiService
                .getUsers(page)
                .then(function(res) {
                    vm.users = res.data;
                });
        }

        vm.nextPage = function() {
            page++;
            refreshData();
        };

        vm.previousPage = function() {
            if (page > 1) {
                page--;
                refreshData();
            }

        };

        vm.userClicked = function($event, user) {
            console.log(user);
            currentUser = user;
            $mdDialog.show({
                controller: UserProfileDialogController,
                targetEvent: $event,
                templateUrl: 'app/views/partials/userProfileDialog.html',
                clickOutsideToClose: true,
                controllerAs: 'vm',
                bindToController: true
            });
        };

        function UserProfileDialogController($mdDialog) {
            var vm = this;


            vm.hide = function() {
                $mdDialog.hide();
            };
            vm.cancel = function() {
                $mdDialog.cancel();
            };

            vm.getCurrentUser = function() {
              return currentUser;
            };

            vm.currentUserAnalyticsProfile = {};

            apiService.getUserAnalyticsProfile(vm.getCurrentUser().uid)
              .then(
                function(res) {
                  vm.currentUserAnalyticsProfile = res.data[0];
                }
              );

        }



        refreshData();
    }

})();
