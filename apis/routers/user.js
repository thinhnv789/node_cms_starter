var express = require('express');
var router = express.Router();
var UserController = require('./../controllers/UserController');

const apiMiddleware = require('./../../middleware/apiMiddleware');

/* API get user info */
router.get('/info', UserController.getInfo);

module.exports = router;
