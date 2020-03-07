var express = require('express');
var router = express.Router();

//const blogModel = require('../models/blog');

const blogService = require('../services/blogService');
const loginService = require('../services/loginService');

const fs = require('fs');
const app = require('../app');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/**
 * Test user
 */
router.get('/new-user', async function(req, res, next){
  const result = await loginService.createUser({email: 'lecongnhan29@gmail.com', pwd: 'NhanLe123', role: 'member', studentID: '18120493', university: 'HCMUS'})
  console.log(result);
})


/**
 * Create a new blog. Needs to change when merged with front-end.
 */
router.get('/new-blog', async function(req, res, next) {

  await blogService.createBlog('Blog mới nè', 'Body blog mới nè.', '5dfad8d9a8ea5953b851ddff', ['testTag', 'Tagtest'], function(newBlogURL){
    res.redirect(newBlogURL);
  });
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
 * This route is for testing only.
 * Finds the blogs by userID.
 */
router.get('/auth/:userID', async function(req, res, next){
  await blogService.findBlogsByUser(req.params.userID, function(result){
    for (i in result){
      console.log(result[i].customURL);
    }

    res.send('Found!');
  });
});


router.get('/tags/:m_tag', async function(req, res, next){
  await blogService.findBlogByTag(req.params.m_tag, function(m_result){
    for (i in m_result){
      console.log(m_result[i].customURL);
    }
    res.end()
  });
})


/**
 * Gets access to a blog by its customURL.
 */
router.get('/:blogURL', async function(req, res, next){ 
  const content = await blogService.findBlogByURL(req.params.blogURL);


  if (content != null){
    blogService.updateView(req.params.blogURL);

    var result = 'Title: ' + content.title + 
    '.\nBody: ' + content.body + 
    '.\nDate created: ' + content.date + 
    '.\nAuthor: ' + content.auth +
    '.\nTags: ';
    for (i in content.tags){
      result = result.concat(content.tags[i], ', ');
    }

    res.send(result);
  }else{
    res.send('Cannot find any blog.');
  }

  res.end();
});


module.exports = router;
