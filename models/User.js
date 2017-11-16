var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  bio: {type:String, default:''},
  commentIds: {type:[Number], default:[]},
  avatarUrl: {type:String, default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlW0AXgdcliz-d8m2nCsYvqKlq1l9rFphGht-5-AF1XIR65RLb'}
});
mongoose.model('User', UserSchema);
