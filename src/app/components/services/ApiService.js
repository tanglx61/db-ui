(function(){
  'use strict';

  var host = 'http://localhost:8000/api/';

  angular.module('app')
        .service('apiService', [
        '$http',
        apiService
  ]);

  function apiService($http){
    function getUsers(page) {
      page = page || 1;
      return $http.get(host + 'users?page=' + page);
    }

    function addUser(username, password, email) {
      return $http.post(host + 'users', {
        username: username,
        password: password,
        email: email
      });
    }


    function getUserAnalyticsProfile(uid) {
      return $http.get(host + 'analytics?uid=' + uid);
    }


    function getPosts(page, sortBy){
      page = page || 1;
      var url = host + 'posts?page=' + page + '&sortBy=' + sortBy;

      return $http.get(url);
    }

    function addPost(title, url, uid) {
      return $http.post(host + 'posts', {
        title: title,
        content: url,
        uid: uid
      });
    }

    function votePost(uid, pid, vote) {
      return $http.post(host + 'vote', {
        pid: pid,
        vote: vote,
        uid: uid
      });
    }


    function getPostVote(uid, pid) {
      var url = host + 'vote?uid=' + uid + '&pid=' + pid;

      return $http.get(url);
    }

    return {
      getUsers: getUsers,
      addUser: addUser,
      getUserAnalyticsProfile: getUserAnalyticsProfile,
      getPosts: getPosts,
      addPost: addPost,
      votePost: votePost,
      getPostVote: getPostVote
    };
  }

})();
