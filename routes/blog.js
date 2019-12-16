var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//const blogModel = require('../models/blog');
const blogService = require('../services/blogService');
const fs = require('fs');
const app = require('../app');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* test create blog*/
router.get('/new-blog', async function(req, res, next) {
  newBlogURL = await blogService.createBlog('Blog mới nè', 'Body blog mới nè.', null, ['testTag', 'Tagtest']);
  res.send(newBlogURL);
});


router.get('/reset', async function(req, res, next){ 
  blogService.emptyDatabase();
  res.end();
});


router.get('/:blogURL', async function(req, res, next){ 
  const content = await blogService.findBlogByURL(req.params.blogURL);
  console.log(content);
  res.end();
});


module.exports = router;
