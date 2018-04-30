var express = require('express');
var router = express.Router();
var AuthController = require('./../controllers/AuthController');

const passport = require('./../../middleware/apiPassport');

/* API login */
router.post('/login', AuthController.postLogin);

/* API logout */
router.get('/logout', passport.isAuthenticated, AuthController.getLogout);

module.exports = router;
