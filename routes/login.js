const passport = require('passport');
const express = require('express');
const router = express.Router();
const uservalidate = require('../middleware/AuthMiddleware');

//local-login
router.get('/', function(req, res, next) {
  res.status(200).json({"msg": "success call login page"});
});
router.post('/',uservalidate.checkInputLogin);


module.exports = router;