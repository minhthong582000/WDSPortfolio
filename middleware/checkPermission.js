const { check, validationResult } = require('express-validator');

const Joi = require('@hapi/joi');


const loginSchema = Joi.object({
  email: Joi.string().min(7).max(30).email().required(),
  password: Joi.string().min(3).max(30).required()
});

function checkInputLogin(req, res, next){
    var criteria = req.body;
    let valid = loginSchema.validate(criteria, { abortEarly: false });
    if (valid.error) {
      res.status(422).json({ errors: valid.error.details });
    }
    else{
      next();
    }
}

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
      next();
    } else {
      res.send("You must login!");
    }
}

function notLoggedIn(req, res, next){
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/login');
}

module.exports = {
  checkInputLogin: checkInputLogin, //validate dữ liệu login
  isLoggedIn: isLoggedIn,
  notLoggedIn: notLoggedIn
}