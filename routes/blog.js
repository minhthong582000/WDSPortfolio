var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const blogModel = require('../models/blog');
const blogService = require('../services/blogService');
const fs = require('fs');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* test create blog*/
router.get('/createBlog', function(req, res, next) {
  res.send('/createBlog');
  newBlog = new blogModel({title: 'Nhân Lê'});
  newBlogID = blogService.createBlog(newBlog);
  console.log(newBlogID);
});


module.exports = router;
