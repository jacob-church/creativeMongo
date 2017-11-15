const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');
var Thread = mongoose.model('Thread');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'public' });
});

// fetch a specific thread
router.param('thread', function(req, res, next, id) {
  var query = Thread.findById(id);
  query.exec(function (err, thread){
    if (err) { return next(err); }
    if (!thread) { return next(new Error("Can't find thread")); }
    req.thread = thread;
    return next();
  });
});

// fetch a specific comment
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);
  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("Can't find comment")); }
    req.comment = comment;
    return next();
  });
});

// fetch a specific user
router.param('user', function(req, res, next, id) {
  var query = User.findById(id);
  query.exec(function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error("Can't find user"));
    req.user = user;
    return next();
  });
});

// GET all the threads
router.get('/threads', function(req, res, next) {
  Thread.find(function(err, threads) {
    if (err) return next(err);
    res.json(threads);
  });
});

// GET a specific thread
router.get('/thread/:thread', function(req, res, next) {
  res.json(req.thread);
});

// POST a new thread
router.post('/thread', function(req, res, next) {
  var thread = new Thread();
  thread.topic = req.body.topic;
  thread.save(function(err, thread) {
    if (err) return next(err);
    console.log(thread);
    res.json(thread);
  });
});

// POST a new comment to a thread
router.post('/thread/:thread', function(req, res, next) {
  var comment = new Comment();
  console.log("body:")
  console.log(req.body);
  comment.userId = req.body.userId;
  comment.message = req.body.message;
  comment.timestamp = req.body.timestamp;
  comment.threadId = req.body.threadId;
  console.log("comment:");
  console.log(comment);
  req.thread.addComment(comment, function(err, thread) {
    if (err) return next(err);
    console.log('comment added to thread');
  });
  comment.save(function(err, comment) {
    if (err) return next(err);
    console.log('comment saved');
    console.log(comment);
    res.json(comment);
  });
});

// PUT an upvote to a comment
router.put('/thread/:thread/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment) {
    if (err) return next(err);
    res.send(comment);
  });
});

// GET a user
router.get('/user/:user', function(req, res, next) {
  res.send(req.user);
});


router.post('/login', function(req, res, next) {
  User.find({ 'username': req.body.username }, function(err, user) {
    if (err) return next(err);
    if (user.length == 0) {
      var newUser = new User();
      newUser.username = req.body.username;
      newUser.password = req.body.password;
      newUser.save(function(err, user) {
        if (err) return next(err);
        console.log(user);
        res.json(user);
      });
    }
    else if (user[0].password == req.body.password) {
      console.log('user logged in');
      res.json(user[0]);
    } else {
      console.log('bad user credentials');
      res.sendStatus(401);
    }
  });
});
module.exports = router;
