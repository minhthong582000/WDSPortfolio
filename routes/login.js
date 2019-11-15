const express = require('express');
const router = express.Router();
const login=require('../controller/loginController')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});
router.post('/',login.createNewAcount);
module.exports = router;
