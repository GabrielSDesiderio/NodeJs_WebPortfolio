const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/user")
const User = mongoose.model('user')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {islogged} = require('../helpers/isLogged')
require("../models/Codes");
const Code = mongoose.model('code');


router.get('/projects', islogged, function (req, res) {
  Code.find().lean().then(function (code) {
    res.render('user/projects', {code: code})
  })
})

router.get("/projects/:id", islogged, function (req, res) {
  Code.findOne({_id:req.params.id}).lean().then(function (code) {
    res.render("user/project_view", {code: code})
  })
})


router.get("/register", function (req, res) {
  res.render('user/register')
})

router.post('/register', function (req, res) {
  var error = [];

  if(!req.body.name || typeof(req.body.name) == undefined || req.body.name == null){
    error.push({error:"Invalid Name"})
  }

  if(!req.body.email || typeof(req.body.email) == undefined || req.body.email == null){
    error.push({error:"Invalid email"})
  }

  if(!req.body.password || typeof(req.body.password) == undefined || req.body.password == null){
    error.push({error:"Invalid Password"})
  }

  if(req.body.password.length < 4){
    error.push({error:"Password to Short"})
  }

  if(req.body.password != req.body.rpassword){
    error.push({error:'The Passwords doesn\'t match'})
  }


  if(error.length > 0){
    res.render('user/register', {error: error})
  } else {
    User.findOne({email: req.body.email}).then(function (user) {
      if(user){
        req.flash("error_msg", "An account is already registry with this email");
        res.redirect('/user/register')
      }else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        })

        bcrypt.genSalt(10, function(error, salt){
          bcrypt.hash(newUser.password, salt, function (error, hash) {
            if(error){
              req.flash("error_msg", "There is a problem while encrypting your password");
              res.redirect('/')
            }
              newUser.password = hash

              newUser.save();

              res.redirect('/')
            })
        })
      }
    })
  }
})

router.get("/login", function (req, res) {
  res.render("user/login")
})

router.post("/login", function (req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next)

})

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', "Logged out")
  res.redirect('/');
})




module.exports = router
