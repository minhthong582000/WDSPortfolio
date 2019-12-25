const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')

/* GET users listing. */
router.get('/', userController.index);
//router.post('/create', userController.create);
router.post('/role', userController.setRole);

router.post('/update/:studentID', userController.updateByStudentID);

router.post('/delete/:studentID', userController.deleteByStudentID);

module.exports = router;
