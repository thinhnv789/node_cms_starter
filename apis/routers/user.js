var express = require('express');
var router = express.Router();
var UserController = require('./../controllers/UserController');

const passport = require('./../../middleware/apiPassport');

/* API get user info */
router.get('/info', UserController.getInfo);

module.exports = router;
