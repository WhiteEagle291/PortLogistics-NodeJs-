const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:String,
  password:String,
  ship : String,
  ship_type:String,
  isAdmin:Boolean
},{ versionKey: false });

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;