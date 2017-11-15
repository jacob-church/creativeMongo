var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  bio: {type:String, default:''},
  commentIds: {type:[Number], default:[]},
  avatarUrl: {type:String, default:''}
});
mongoose.model('User', UserSchema);
