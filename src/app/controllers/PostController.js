(function() {
    'use strict';

    angular
        .module('app')
        .controller('PostController', [
            'apiService', '$scope', '$rootScope', '$mdDialog',
            PostController
        ]);

    function PostController(apiService, $scope, $rootScope, $mdDialog) {
        var vm = this;
        vm.uid = $rootScope.uid;

        var page = 1;

        var currentPost;

        vm.posts = [];

        vm.sortBy = 'pid';

        var unbind = $rootScope.$on('postAdded', function() {

            refreshData();
        });


        

        var unbind2 = $rootScope.$on('setUid', function() {
            vm.uid = $rootScope.uid;
            console.log('uid set to ', vm.uid);
            refreshData();
        });

        var unbind3 = $rootScope.$on('postDownvoted', function(event, pid){
            console.log(pid);
            if (!vm.uid) { return; }
            apiService.votePost(vm.uid, pid, -1);

        });

         var unbind4 = $rootScope.$on('postUpvoted', function(event, pid){
            if (!vm.uid) { return; }

            apiService.votePost(vm.uid, pid, 1);

        });

        $scope.$on('$destroy', unbind);
        $scope.$on('$destroy', unbind2);
        $scope.$on('$destroy', unbind3);
        $scope.$on('$destroy', unbind4);

        function refreshData() {
            apiService
                .getPosts(page, vm.sortBy)
                .then(function(res) {
                    vm.posts = res.data;

                    vm.posts.forEach(function(p){
                        p.content += '?r=' + parseInt(1000000 * Math.random());
                    });

                    if (vm.uid) {
                        vm.posts.forEach(function(p){
                            apiService.getPostVote(vm.uid, p.pid).then(function(res){
                                var vote = res.data.vote;
                                console.log('vote for ' + p.pid + ' is ' + vote);
                                $rootScope.$emit('postVoteRetrieved', {pid: p.pid, vote: vote});
                            });
                        });
                    }
                    
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

        vm.changeSorting = function(sortBy) {
            if (vm.sortBy === sortBy) return;

            vm.sortBy = sortBy;
            page = 1;

            refreshData();
        };

        vm.postClicked = function($event, user) {
            console.log(user);
            return;
            currentPost = user;
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

            vm.getCurrentPost = function() {
              return currentPost;
            };

            vm.currentUserAnalyticsProfile = {};

            // apiService.getUserAnalyticsProfile(vm.getCurrentUser().uid)
            //   .then(
            //     function(res) {
            //       vm.currentUserAnalyticsProfile = res.data[0];
            //     }
            //   );

        }



        refreshData();
    }

})();
