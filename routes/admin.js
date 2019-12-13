var express = require('express');
var router = express.Router();
const userController = require('../controller/userController')

/* GET users listing. */
router.get('/', userController.index);

router.post('/create/:studentID', userController.createByStudentID)

router.post('/update/:studentID', userController.updateByStudentID)

router.post('/delete/:studentID', userController.deleteByStudentID)


module.exports = router;
