const passport = require('passport');
const express = require('express');
const router = express.Router();
const uservalidate = require('../middleware/checkPermission');

//local-login
router.get('/', function(req, res, next) {
  res.status(200).json({"msg": "success call login page"});
});

router.post('/',uservalidate.checkInputLogin, passport.authenticate("local.login"),function(req,res){
    res.status(200).json({ "msg": "success login" });
});


module.exports = router;
