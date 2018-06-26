var express = require('express');
var router = express.Router();
var AccountController = require('./../controllers/AccountController');

const apiMiddleware = require('./../../middleware/apiMiddleware');

/* API get account list */
router.get('/data', AccountController.getData);

module.exports = router;
