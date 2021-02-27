//Requirements
  const express = require('express');
  const router = express.Router();
  const mongoose = require('mongoose');
  require("../models/Codes");
  const Code = mongoose.model('code');
  const {isAdmin} = require('../helpers/isAdmin')


//admin/
  router.get('/', isAdmin ,function (req, res) {
    res.render('admin/index')
  })

//projects page
  router.get('/projects', isAdmin,function (req, res) {
    Code.find().lean().then(function (code) {
      res.render('admin/projects', {code: code})
    })
  })

//new project
  router.get('/projects/new',isAdmin,function (req, res) {
      res.render('admin/addproject')
  })

//edit projects
  router.get("/projects/edit/:id",isAdmin, function (req, res) {
    Code.findOne({_id:req.params.id}).lean().then(function (codes) {
      res.render("admin/editproject", {codes: codes})
    })
  })


//Update Edit
  router.post("/project/edited",isAdmin, function (req, res) {
    Code.findOne({_id:req.body.id}).then(function (codes) {
      codes.title = req.body.title;
      codes.code = req.body.code;

      codes.save().then(function () {
        res.redirect('/admin/projects')
      })
    })
  })

//Delete Projects
  router.post("/project/delete",isAdmin, function (req, res) {
    Code.remove({_id: req.body.id}).then(function () {
      res.redirect('/admin/projects')
    })
  })

//post Project
  router.post("/projects/confirmation",isAdmin, function (req, res) {
    var error =[]

    if(!req.body.title || typeof(req.body.title) == undefined || req.body.title == null){
      error.push({text: "Title Invalid"})
    }

    if(!req.body.code || typeof(req.body.code) == undefined || req.body.code == null){
      error.push({text: "Code Invalid"})
    }

    if(error.length > 0){
      res.render("admin/addproject", {error: error})
    }else {

        const newCode = {
          title: req.body.title,
          code: req.body.code
        }

        new Code(newCode).save().then(function () {
          req.flash("success_msg", "Your Project has been encoded")
          res.redirect('/admin/projects')
        }).catch(function (req, res) {
          req.flash("error_msg", "There is an error while encoding your code in the database")
        })


    }

  })

  module.exports = router;
