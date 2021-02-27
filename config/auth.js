const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require("../models/user");
const User = mongoose.model('user')



module.exports = function (passport) {
  passport.use(new localStrategy({usernameField: 'email'}, function (email, password, done) {
    User.findOne({email: email}).then(function (user) {
      if(!user){
        return done(null, false)
      }

      bcrypt.compare(password, user.password, function (err, match) {
        if(match){
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
    })
  }))


passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})







}
