var express = require('express');
var User = require('../models/userModel');
var md5 = require('js-md5');
var router = express.Router();

router.get('/signin', function(req, res, next) {
  res.render('signin', { layout: 'layout-signin' });
});

router.post('/signin', function(req, res, next) {
  var email = req.body.email;
  var password = md5(req.body.password);
  // validate inputs
  req.checkBody('email', 'Email is required').
      notEmpty().withMessage('Email can not be empty').
      isEmail().withMessage('Please enter a valid email');
  req.checkBody('password', 'Password is required').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
        messages.push(error.msg);
    });
    res.render('signin', {layout:'layout-signin', error: messages.length > 0,messages: messages});
  }else{   
    // authenticate the user details
    User.find({'email': email, 'password': password}, function(err, user){
      if (err){
        res.render('signin', { 
          layout: 'layout-signin', 
          error: true, 
          messages:[err.msg]
        });
      }else if (user.length < 1){
        res.render('signin', { 
          layout: 'layout-signin', 
          error: true, 
          messages:["Invalid userid or passsword"]
        });
      }else{
        // you found a valid user
        // set the session
        console.log(JSON.stringify(user));
        req.session.isAuthenticated = true;
        req.session.user = user[0];
        res.locals.user = user[0];
        res.render('dashboard', { 
          layout: 'layout-signin', 
          title: 'Admin Dashboard'
        });
      }
    });
  }
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { layout: 'layout-signin' });
});

router.post('/signup', function(req, res, next) {
  // read the values from the body
  // [ take the password and encrypt it ]
  // use the model and save the data
  var userModel = new User();
  console.log(userModel)
  userModel.name = req.body.name;
  userModel.email = req.body.email;
  userModel.password = md5(req.body.password);
  userModel.createAt = new Date();
  userModel.save(function(err, user){
    console.log(JSON.stringify(user));

    if(err) res.send(err);
    res.redirect('/signin');
  });
});




router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { layout: 'layout-signin' });
});

router.post('/confirm', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var description = req.body.description;

  User.find({'name': name, 'email': email, 'mobile': mobile, 'description': description }, function(err, user){
    var data = req.body;
    req.session.isAuthenticated = true;
    req.session.user = user[0];
    res.locals.user = user[0];
    console.log(JSON.stringify(user[0]));
    res.render('confirm', { 
      layout: 'layout-signin', 
      title: 'Admin Dashboard',
      data: data,
    });
  });
});



router.get('/dashboard', function(req, res, next) {
  res.render('confirm', { layout: 'layout-signin',data :data});
});

router.post('/dashboard', function(req, res, next) {
var data = req.body;
console.log(JSON.stringify(data));
  // read the values from the body
  // [ take the password and encrypt it ]
  // use the model and save the data
  var userModel = new User();
  console.log(userModel)
  userModel.name = req.body.name;
  userModel.email = req.body.email;
  userModel.mobile = req.body.mobile;
  userModel.description = req.body.description;
  userModel.createAt = new Date();
  userModel.save(function(err, user){
    console.log(JSON.stringify(user[0]));

    if(err) res.send(err);
    res.redirect('/dashboard');
  });

});
 

module.exports = router;