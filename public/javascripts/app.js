angular.module('app', ['ui.router'])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('threads', {
          url: '/threads',
          templateUrl: '/threads.html',
          controller: 'threadCtrl'
        })
        .state('comments', {
          url: '/comments/{id}',
          templateUrl: '/comments.html',
          controller: 'commentCtrl'
        });

        $urlRouterProvider.otherwise('threads')
    }
  ])
  .factory('chatData', [
    '$http',
    function($http) {
      console.log(3.5)
      var API_ROOT = 'chatData';
      return {
        get: function() {
          return $http
            .get(API_ROOT)
            .then(function (resp) {
              return resp.data
          })
        }
      }
  }])
  .controller('threadCtrl', [
    '$scope',
    '$state',
    '$http',
    'chatData',
    function($scope, $state, $http, chatData) {
      $scope.threads = [];

      //fetch current threads in the chat room
      chatData.get()
        .then( function(data) {
          console.log(data);
          $scope.threads = data;
        });

      $scope.enterThread = function(index) {
        $state.go('comments', {id: index})
      };

      $scope.addThread = function() {
        if ($scope.topic == '' || $scope.name == '' || $scope.message == '') return;
        let formData = {
          topic: $scope.topic, //grab topic from form
          comments: [
            {
              name: $scope.name, //grab name from form
              message: $scope.message, //grab message from form
              timestamp: Date().substr(0,21),
              avatarUrl: $scope.url, //grab url from form,
              upvotes: 0
            }
          ]
        };
        console.log(formData);
        let threadUrl = '/newThread';
        $http({
          url: threadUrl,
          method: 'POST',
          data: formData
        })
        .then(function(resp){
          console.log('Message delivered!');
          $scope.threads.push(formData);
          $scope.topic = '';
          $scope.name = '';
          $scope.message = '';
          $scope.url = '';
        }, function(resp){
          console.log('Message could not be delivered.')
        })
      }
  }])
  .controller('commentCtrl', [
    '$scope',
    '$stateParams',
    '$http',
    'chatData',
    function($scope, $stateParams, $http, chatData) {
      $scope.comments = [];
      $scope.topic = '';
      //fetch current threads in the chat room
      chatData.get()
        .then( function(data) {
          console.log(data);
          $scope.comments = data[$stateParams.id].comments;
          $scope.topic = data[$stateParams.id].topic;
        });

      $scope.addComment = function() {
          if ($scope.name == '' || $scope.message == '') return;
          let index = parseInt($stateParams.id);
          let formData = {
            name: $scope.name,
            message: $scope.message,
            timestamp: Date().substr(0,21),
            avatarUrl: $scope.url,
            upvotes: 0
          }
          let threadUrl = '/newComment?i=' + index;
          $http({
            url: threadUrl,
            method: 'POST',
            data: formData
          })
          .then(function(resp) {
            console.log('Message sent!')
            $scope.comments.push(formData);
            $scope.name = '';
            $scope.message = '';
            $scope.url = '';
          }, function(resp) {
            console.log('Message could not be delivered.')
          });
      }

      $scope.upvote = function(index) {
        let threadIndex = parseInt($stateParams.id);
        let upvoteUrl = '/upvote';
        let data = {
          threadIndex: parseInt($stateParams.id),
          commentIndex: index
        }
        $http({
          url: upvoteUrl,
          method: 'POST',
          data: data
        })
        .then(function(resp) {
          $scope.comments[index].upvotes++;
        }, function(resp) {
          console.log('Upvote failed');
        })
        comment.upvotes += 1;
      }
    }]);
