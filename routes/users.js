var express = require('express');
var router = express.Router();
const mongoose=require('mongoose')
const plm=require('passport-local-mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/testinguser')

// userModel.js


const userSchema =mongoose.Schema({
  username: {
    type: String,
   
  },
  name:{
    type:String,
  },

  email: {
    type: String,
   
  },
  password: {
    type: String,
   
  },
  profileImage:{
    type:String
  },
  bio:{
    type:String,
  },
  posts:[{
    // sirf posts ki is store hogi na ki real post
type:mongoose.Schema.Types.ObjectId ,
ref:"post"
  }]
 
});
userSchema.plugin(plm)
// is line ki wajah se create read delete db mein kr payenge
const User = mongoose.model('User', userSchema);

module.exports = User;



