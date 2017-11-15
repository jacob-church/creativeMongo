
function loggedIn(userId) {
  //return true;
  return userId != -1;
}

angular.module('app', ['ui.router'])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('main', {
          url: '/main',
          templateUrl: '/main.html',
          controller: 'mainCtrl'
        })
        .state('thread', {
          url: '/thread/{id}',
          templateUrl: '/thread.html',
          controller: 'threadCtrl'
        })
        .state('user', {
          url: '/user/{id}',
          templateUrl: '/user.html',
          controller: 'userCtrl'
        });
        $urlRouterProvider.otherwise('main')
    }
  ])
  .factory('login', function() {
    return {
      username: '',
      password: ''
    }
  })
  .controller('mainCtrl', [
    '$scope',
    '$state',
    '$http',
    'login',
    function($scope, $state, $http, login) {
      $scope.threads = [];
      $scope.userId = -1;

      $scope.getThreads = function() {
        return $http.get('/threads')
          .then(function(data) {
            console.log(data.data)
            angular.copy(data.data, $scope.threads);
          });
      }
      $scope.getThreads();
      $scope.loggedIn = loggedIn;

      $scope.gotoThread = function(threadId) {
        $state.go('thread', {id: threadId});
      }

      $scope.login = function() {
        var formData = {
          username: $scope.username,
          password: $scope.password
        }
        return $http.post('/login', formData)
          .then(function(data) {
            login.username = data.data.username;
            login.password = data.data.password;
            $scope.userId = data.data._id;
            $scope.username = '';
            $scope.password = '';
          })
      }

      $scope.newThread = function() {
        var thread = {
          topic: $scope.topic
        }
        var comment = {
          userId: $scope.userId,
          message: $scope.message,
          timestamp: Date()
        }
        return $http.post('/thread', thread)
          .then(function(data) {
            $scope.threads.push(data.data)
            console.log(data)
            comment.threadId = data.data._id;
            $http.post('/thread/' + data.data._id, comment)
              .then(function(data) {
                console.log(data);
                console.log('new thread posted');
              });
          });
      }
  }])
  .controller('threadCtrl', [
    '$scope',
    '$stateParams',
    '$http',
    'login',
    function($scope, $stateParams, $http, login) {
      $scope.comments = [];
      $scope.topic = '';
      $scope.userId = -1;

      $scope.getAll = function() {
        return $http.get('/thread/' + $stateParams.id)
          .then(function(data) {
            data = data.data
            console.log(data)
            $scope.topic = data.topic;
            angular.copy(data.comments, $scope.comments);
          });
      }
      $scope.getAll();
      $scope.loggedIn = loggedIn;

      $scope.login = function() {
        var formData = {
          username: $scope.username,
          password: $scope.password
        }
        return $http.post('/login', formData)
          .then(function(data) {
            login.username = data.data.username;
            login.password = data.data.password;
            $scope.userId = data.data._id;
            $scope.username = '';
            $scope.password = '';
          })
      }

      $scope.newComment = function() {
        message = {
            message: $scope.message,
            userId: $scope.userId,
            timestamp: Date(),
            threadId: $stateParams.id
        }
        console.log("message")
        console.log(message);
        return $http.post('/thread/' + $stateParams.id, message)
          .then(function(data) {
            console.log('comment posted');
            $scope.comments.push(data.data);
          });
      }

      $scope.upvote = function(comment) {
        return $http.put('/thread/' + $stateParams.id + '/' + comment._id + '/upvote')
          .then(function(data) {
            console.log('upvote worked');
            comment.upvotes += 1;
          });
      }
    }
  ])
  .controller('userCtrl', [
    '$scope',
    '$stateParams',
    '$http',
    'login',
    function($scope, $stateParams, $http, login) {
      $scope.username = '';
      $scope.comments = [];
      $scope.avatarUrl = '';
      $scope.bio = '';

      // get these default values for a user
      $scope.getAll = function() {
        return $http.get('/user/' + $stateParams.id)
          .then(function(data) {
            angular.copy(data.username, $scope.username);
            angular.copy(data.avatarUrl, $scope.avatarUrl);
            angular.copy(data.bio, $scope.bio);
            angular.copy(data.comments, $scope.comments);
          });
      }
      $scope.getAll();
    }
  ])
