var mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
  userId: String,
  threadId: String,
  message: String,
  upvotes: {type:Number, default: 0},
  timestamp: Number
});
CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1
  this.save(cb)
};
mongoose.model('Comment', CommentSchema);
