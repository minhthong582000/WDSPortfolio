var express = require('express');
var router = express.Router();
const userController = require('../controller/userController')

/* GET users listing. */
router.get('/', userController.index);

router.post('/:studentID', userController.createByStudentID)

router.patch('/:studentID', userController.updateByStudentID)

router.delete('/:studentID', userController.deleteByStudentID)


module.exports = router;