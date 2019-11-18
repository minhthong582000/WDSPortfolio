var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

/* GET users listing. */
router.get('/', userController.index);

router.post('/create', userController.create);

router.post('/update', userController.updateByStudentID)

router.post('/delete', userController.deleteByStudentID)


module.exports = router;
