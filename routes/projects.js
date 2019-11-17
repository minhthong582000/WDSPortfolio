var express = require('express');
var router = express.Router();

var projectController = require('../controller/projectController');

/* GET users listing. */
router.get('/admin/project', projectController.info);

router.get('/admin/project', projectController.create);

router.post('/admin/project', projectController.update);

router.post('/admin/project', projectController.deleteById);

module.exports = router;
