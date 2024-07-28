// models/post.js

const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
  
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  picture: {
    type: String,
    
  },
  caption:{
    type:String,
  },
  
  date: {
    type: Date,
    default: Date.now,
  },
  likes:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  ]
});

// Create the Post model
const Post = mongoose.model('post', postSchema);

// Export the Post model
module.exports = Post;
