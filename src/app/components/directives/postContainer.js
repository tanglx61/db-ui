'use strict';

angular.module('app')
  .directive('postContainer', function($rootScope) {
    var rootScope = $rootScope;
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: { title: '@', image: '@', points: '@', state: '@', pid: '@'},
      controller: function($scope){
        $scope.postUpvoted = function(pid){
          $scope.points++;
          $scope.setVoted(1);
          rootScope.$emit('postUpvoted', pid);
        };

        $scope.postDownvoted = function(pid){
          $scope.points--;
          $scope.setVoted(-1);
          rootScope.$emit('postDownvoted', pid);
        };

        var unbind = rootScope.$on('postVoteRetrieved', function(event, data){
          var pid = data.pid;
          console.log('retrieved pid' + data.pid);
          if (pid == $scope.pid) {
            $scope.setVoted(data.vote);
          }
        });

        $scope.$on('$destroy', unbind);

        $scope.voted = false;

        $scope.isUidSet = function(){
          return rootScope.uid !== null && rootScope.uid !== undefined && rootScope.uid !== '';
        };


        $scope.setVoted = function(vote) {
          $scope.vote = parseInt(vote);
          if (vote === 1) {
            $scope.upvoteButtonClass = 'md-raised';
            $scope.voted = true;
          } else if (vote === -1) {
            $scope.downvoteButtonClass = 'md-raised';
            $scope.voted = true;
          }
        };

        $scope.downvoteButtonClass = '';
        $scope.upvoteButtonClass = '';
      },
      template: '' +
                '<section layout-margin class="md-whiteframe-z1 panel-widget">' +
                '  <md-toolbar md-theme="custom" class="md-hue-1 panel-widget-toolbar">' +
                '    <div class="md-toolbar-tools">' +
                '      <h3 class="panel-widget-tittle">{{title}}</h3>' +
                '      <span flex></span>' +
                '      <md-button ng-show="options" ng-click="$showOptions = !$showOptions" class="md-icon-button" aria-label="Show options">' +
                '        <i class="material-icons">more_vert</i>' +
                '      </md-button>' +
                '    </div>' +
                '  </md-toolbar>' +

                '  <img class="post-image" src="{{image}}">' +

                '  <h5>{{points}} points</h5>' +


                '    <div class="md-toolbar-tools " layout-align="end center">' +

                '      <md-button class="md-icon-button  {{upvoteButtonClass}}" ng-click="postUpvoted(pid)" ng-disabled="voted" ng-show="isUidSet()">' +
                '        <i class="material-icons">keyboard_arrow_up</i>' +
                '      </md-button>' +

                '      <md-button class="md-icon-button {{downvoteButtonClass}}" ng-click="postDownvoted(pid)" ng-disabled="voted" ng-show="isUidSet()">' +
                '        <i class="material-icons ">keyboard_arrow_down</i>' +
                '      </md-button>' +
                '    </div>' +
                '</section>',
      compile: function(element, attrs, linker) {
        return function(scope, element) {
          linker(scope, function(clone) {
            element.append(clone);
          });
        };
      }
    };
  });
