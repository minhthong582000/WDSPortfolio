var express = require('express');
var router = express.Router();
var projectController = require('../controller/projectController');

/* GET users listing. */
router.get('/', projectController.info);

router.post('/projects/create', projectController.create);

router.put('/projects/update', projectController.update);

router.delete('/projects/delete', projectController.deleteById);

module.exports = router;
