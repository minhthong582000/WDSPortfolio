var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const blogModel = require('../models/blog');
const blogService = require('../services/blogService');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* test create blog*/
router.get('/createBlog', function(req, res, next) {
  res.send('/createBlog');
  newBlog = new blogModel({title: 'New Tile'});
  blogService.createBlog(newBlog);
});

module.exports = router;
