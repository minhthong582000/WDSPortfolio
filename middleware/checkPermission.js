const { check, validationResult } = require('express-validator');

module.exports = {
  //validate dữ liệu login
  keyValidate: [
    check('email').isLength({ max: 30 }).withMessage('Please enter less than 30 characters')
      .custom(function (value) {
        //kiểm tra username có là email hoặc mssv hay ko, nếu sai => throw error, ngừng check database
        const emailRegex = /\S+@\S+\.\S+/i;
        const studentIDRegex = /([0-9]){8}/i;
        if (emailRegex.test(value) || studentIDRegex.test(value)) {
          return true;
        }
        else
          throw new Error('Sorry,You must use email or student ID');
      }),
    check('password').isLength({ max: 30 }).withMessage('Please enter less than 30 characters')
  ],
  //kiểm tra error khi validate login, if có error => push vào mảng trả về front dữ liệu errors dạng json
  validate: validations => {
    return async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() }); /*trả ra dữ liệu json với errors là array dạng 
                                                              errors: [{  "location": "body",
                                                                  "msg": "Invalid value",
                                                                  "param": "username"}]
                                                              }]*/
      }
      else
        next();
    }
  },
  //hàm kiểm tra login chưa
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.send("You must login!");
    }
  },
  
  notLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/login');
  }
}