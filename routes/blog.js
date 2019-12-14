var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* test create blog*/
router.get('/createBlog', async function(req, res, next) {
  res.send('Creating blog');
  let testObject = {
    title: "test1"
  }
  newBlogURL = await blogService.createBlog(testObject);

  console.log("result" + newBlogURL);
});


router.get('/:blogURL', function(req, res, next){ 
  newBlog = new blogModel({title: 'Nhân Lê'});
  newBlogURL = blogService.createBlog(newBlog);

  const content = blogService.findBlogByURL(req.params.blogURL);
  console.log(content);
});

module.exports = router;
