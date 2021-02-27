const mongoose = require('mongoose');
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');


const User = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  isAdmin:{
    type: Number,
    default: 0
  }
})

User.methods.isPasswordValid = function(rawPassword, callback) {
    bcrypt.compare(rawPassword, this.password, function(err, same) {
        if (err) {
            callback(err);
        }
        callback(null, same);
    });
  };

mongoose.model("user", User)
