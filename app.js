const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const admin = require('./path/admin')
const path = require('path');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const flash = require('connect-flash');
const userEnd = require('./path/userEnd')
const passport = require('passport');
require("./config/auth")(passport);

//Config
//Session
  app.use(session ({
    secret: "Your Secret Here",
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

//Middleware
  app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.user = req.user || null;
    next()
  })

//BodyParser
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

//MogonDB
  const uri = "mongodb+srv://<username>:<password>@projects.kgb2h.mongodb.net/projects?retryWrites=true&w=majority";
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//Handlebars
  app.engine('handlebars', handlebars({defaultLayout: 'main'}));
  app.set('view engine', 'handlebars');


//Public
  app.use(express.static(path.join(__dirname,'public')))


//Path
app.use('/admin', admin);
app.use('/user', userEnd)

app.get('/', function (req, res) {
  res.render('user/home')
})

//Others
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Umbler listening on port %s', port);
});
