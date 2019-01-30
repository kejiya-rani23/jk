var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var index = require('./routes/index');

var app = express();
var auth = require('./middleware/auth');
var session = require('express-session');
var validator = require('express-validator');
var mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/jk",function(e){
  console.log('You are now connected to mongodb...');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'top secret',
	saveUninitialized: false,
	resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 1000 }
}));
app.use(validator());
app.use(auth.authenticated);

app.use('/', index);
app.use('/users', index);

module.exports = app;