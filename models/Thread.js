var mongoose = require('mongoose')
var ThreadSchema = new mongoose.Schema({
  topic: String,
  comments: {type: [], default: []}
});
ThreadSchema.methods.addComment = function(comment, cb) {
  this.comments.push(comment);
  console.log("thread comments:");
  console.log(this.comments);
  this.save(cb);
};
mongoose.model('Thread', ThreadSchema);
