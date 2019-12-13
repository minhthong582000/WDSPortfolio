var express = require('express');
var router = express.Router();
var activityController = require('../controller/activityController');

/* GET users listing. */
router.get('/', activityController.all); //Xem tất cả hoạt động

router.post('/', activityController.create); //Thêm hoạt động

router.get('/:id', activityController.info); //Thông tin hoạt động

router.post('/:id', activityController.update); //Cập nhật hoạt động

router.delete('/:id', activityController.deleteById) //Xóa hoạt động


module.exports = router;
