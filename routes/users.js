const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb+srv://ansarirehaan811:rehaan811@rehaan.yjqinp0.mongodb.net/pinterestClone');
// mongoose.connect("mongodb://localhost:27017/Pinterest_Clone");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post"
  }],
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  profileImage: String,
  contact: Number,
  boards: {
    type: Array,
    default: []
  }
})

userSchema.plugin(plm)
module.exports = mongoose.model('user', userSchema);
