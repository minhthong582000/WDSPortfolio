var express = require('express');
var router = express.Router();
let signupController = require('../controller/signupController')

router.post('/', signupController.forgotPassword)
router.post('/:token', signupController.setNewPassword)
module.exports = router;