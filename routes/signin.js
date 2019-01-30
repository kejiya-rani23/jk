var express = require('express');
var path = require('path');
var fs = require('fs');
var unzip = require('unzip');
var router = express.Router();



router.get('/', function (req, res, next) {
    res.render('/dashboard', {  
      title: 'Admin Dashboard'
    });
  });
  
  module.exports = router;