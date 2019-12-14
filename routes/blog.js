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
  res.send('Creating blog');

  newBlog = new blogModel({title: 'Nhân Lê'});
  newBlogURL = blogService.createBlog(newBlog);

  console.log(newBlogURL);
});


router.get('/:blogURL', function(req, res, next){ 
  newBlog = new blogModel({title: 'Nhân Lê'});
  newBlogURL = blogService.createBlog(newBlog);

  const content = blogService.findBlogByURL(req.params.blogURL);
  console.log(content);
});


module.exports = router;
