var express = require('express');
var router = express.Router();
var AuthController = require('./../controllers/AuthController');

const apiMiddleware = require('./../../middleware/apiMiddleware');

/* API login */
router.post('/login', AuthController.postLogin);

/* API logout */
router.get('/logout', apiMiddleware.isAuthenticated, AuthController.getLogout);

module.exports = router;
