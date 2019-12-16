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


/**
 * Create a new blog. Needs to change when merged with front-end.
 */
router.get('/new-blog', async function(req, res, next) {
  await blogService.createBlog('Blog mới nè', 'Body blog mới nè.', null, ['testTag', 'Tagtest'], function(newBlogURL){
    res.redirect(newBlogURL);
  });
});


/**
 * ###This route is for testing only.
 * Removes everything from the database.
 */
router.get('/reset', async function(req, res, next){ 
  blogService.emptyDatabase();
  res.end();
});


/**
 * Removes a blog by its customURL.
 */
router.get('/remove/:blogURL', async function(req, res, next){
  const removingAction = await blogService.removeBlogByURL(req.params.blogURL, function(m_result){
    if (m_result){
      res.send('Removed a blog.');
    }else{
      res.send('Cannot remove blog.');
    }
  });


  res.end();
})


/**
 * Gets access to a blog by its customURL.
 */
router.get('/:blogURL', async function(req, res, next){ 
  //{censorship: res.censorship, title: res.title, body: res.body, date: res.date, auth: res.auth, tags: res.tags}
  const content = await blogService.findBlogByURL(req.params.blogURL);


  if (content != null){
    var result = 'Title: ' + content.title + 
    '.\nBody: ' + content.body + 
    '.\nDate created: ' + content.date + 
    '.\nAuthor: ' + content.auth +
    '.\nTags: ';
    await content.tags.forEach(tag => {
      result.concat(tag, ', ');
    });

    res.send(result);
  }else{
    res.send('Cannot find any blog.');
  }

  res.end();
});


module.exports = router;
