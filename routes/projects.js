var express = require('express');
var router = express.Router();
var projectController = require('../controller/projectController');

/* GET users listing. */
router.get('/', projectController.info);

router.post('/', projectController.create);

router.post('/update', projectController.update);

router.post('/delete', projectController.deleteById);

module.exports = router;
