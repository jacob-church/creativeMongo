var mongoose = require('mongoose')
var CommentSchema = new mongoose.Schema({
  userId: Number,
  threadId: Number,
  message: String,
  upvotes: {type:Number, default: 0},
  timestamp: Number
});
CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1
  this.save(cb)
};
mongoose.model('Comment', CommentSchema);

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  bio: String,
  commentIds: [Number],
  avatarUrl: String
});
mongoose.model('User', UserSchema);

var ThreadSchema = new mongoose.Schema({
  topic: String,
  comments: {type: [], default: []}
});
ThreadSchema.methods.addComment = function(comment, cb) {
  this.comments.push(comment);
  this.save(cb);
};
mongoose.model('Thread', ThreadSchema);
