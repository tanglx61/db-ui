(function() {
'use strict';

    angular
        .module('app')
        .controller('MainController', [
            'navService', '$mdSidenav', '$mdBottomSheet', 
            '$log', '$q', '$state', '$mdToast', '$mdDialog',
            'apiService', '$rootScope',
            MainController
        ]);

    function MainController(navService, $mdSidenav, $mdBottomSheet, $log, 
    	$q, $state, $mdToast, $mdDialog, apiService , $rootScope) {
        var vm = this;

        var currentUid;

        vm.menuItems = [];
        vm.selectItem = selectItem;
        vm.toggleItemsList = toggleItemsList;
        vm.showActions = showActions;
        vm.title = $state.current.data.title;
        vm.showSimpleToast = showSimpleToast;
        vm.toggleRightSidebar = toggleRightSidebar;

        navService
            .loadAllItems()
            .then(function(menuItems) {
                vm.menuItems = [].concat(menuItems);
            });




        function AddUserDialogController($mdDialog) {
            var vm = this;


            vm.hide = function() {
                $mdDialog.hide();
            };
            vm.cancel = function() {
                $mdDialog.cancel();
            };

            vm.addUser = function(){
            	if (vm.username && vm.password && vm.email) {
            		apiService.addUser(vm.username, vm.password, vm.email)
            		.then(
            			function() {
            				vm.hide();
            				$rootScope.$emit('userAdded');

            			},

            			function(err){
            				vm.error = err;

            			}
            		);
            	}
            };
        }

        function AddPostDialogController($mdDialog) {
            var vm = this;

            vm.uid = currentUid;

            vm.hide = function() {
                $mdDialog.hide();
            };
            vm.cancel = function() {
                $mdDialog.cancel();
            };

            vm.addPost = function(){
                if (vm.imageUrl && vm.title && vm.uid) {
                    apiService.addPost(vm.title, vm.imageUrl, vm.uid)
                    .then(
                        function() {
                            vm.hide();
                            $rootScope.$emit('postAdded');

                        },

                        function(err){
                            vm.error = err;

                        }
                    );
                }
            };
        }


        vm.addUser = function($event) {
            $mdDialog.show({
                controller: AddUserDialogController,
                targetEvent: $event,
                templateUrl: 'app/views/partials/addUserDialog.html',
                clickOutsideToClose: true,
                controllerAs: 'vm',
                bindToController: true
            });
        };




        vm.addPost = function($event) {
            $mdDialog.show({
                controller: AddPostDialogController,
                targetEvent: $event,
                templateUrl: 'app/views/partials/addPostDialog.html',
                clickOutsideToClose: true,
                controllerAs: 'vm',
                bindToController: true
            });
        };


        vm.setUid = function(){
            currentUid = vm.uid;
            $rootScope.uid = vm.uid;
            $rootScope.$emit('setUid');
        };

        function toggleRightSidebar() {
            $mdSidenav('right').toggle();
        }

        function toggleItemsList() {
            var pending = $mdBottomSheet.hide() || $q.when(true);

            pending.then(function() {
                $mdSidenav('left').toggle();
            });
        }

        function selectItem(item) {
            vm.title = item.name;
            vm.toggleItemsList();
            vm.showSimpleToast(vm.title);
        }

        function showActions($event) {
            $mdBottomSheet.show({
                parent: angular.element(document.getElementById('content')),
                templateUrl: 'app/views/partials/bottomSheet.html',
                controller: ['$mdBottomSheet', SheetController],
                controllerAs: "vm",
                bindToController: true,
                targetEvent: $event
            }).then(function(clickedItem) {
                clickedItem && $log.debug(clickedItem.name + ' clicked!');
            });

            function SheetController($mdBottomSheet) {
                var vm = this;

                vm.actions = [{
                    name: 'Share',
                    icon: 'share',
                    url: 'https://twitter.com/intent/tweet?text=Angular%20Material%20Dashboard%20https://github.com/flatlogic/angular-material-dashboard%20via%20@flatlogicinc'
                }, {
                    name: 'Star',
                    icon: 'star',
                    url: 'https://github.com/flatlogic/angular-material-dashboard/stargazers'
                }];

                vm.performAction = function(action) {
                    $mdBottomSheet.hide(action);
                };
            }
        }

        function showSimpleToast(title) {
            $mdToast.show(
                $mdToast.simple()
                .content(title)
                .hideDelay(2000)
                .position('bottom right')
            );
        }
    }

})();
