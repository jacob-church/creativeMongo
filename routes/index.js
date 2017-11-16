const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');
var Thread = mongoose.model('Thread');
// User.remove({},function(err){})
// Comment.remove({},function(err){})
// Thread.remove({},function(err){})


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
    res.json(thread);
  });
});

// POST a new comment to a thread
router.post('/thread/:thread', function(req, res, next) {
  var comment = new Comment({
    userId:req.body.userId,
    message:req.body.message,
    timestamp:req.body.timestamp,
    threadId:req.body.threadId
  });
  console.log(comment);
  comment.save(function(err, comment) {
    if (err) return next(err);
    console.log('comment saved');
  });
  User.findById(req.body.userId).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error("User can't be found"));
    var threadComment = {
      _id: comment._id,
      upvotes: comment.upvotes,
      username: user.username,
      message:req.body.message,
      timestamp:req.body.timestamp,
      avatarUrl: user.avatarUrl,
      userId: user._id
    }
    req.thread.addComment(threadComment, function(err, thread) {
      if (err) return next(err);
      res.json(threadComment);
    });
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
  res.json(req.user);
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
