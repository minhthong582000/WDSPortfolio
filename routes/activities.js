var express = require('express');
var router = express.Router();
var controller = require('../controller').activityController;

/* GET users listing. */
router.route('/')
.get(controller.getActivities)
.post(controller.postCreateActivity)


router.route('/:name')
.get(controller.getActivityInfo)
.post(controller.postEditActivity)
.delete(controller.getDeleteActivity)

module.exports = router;
