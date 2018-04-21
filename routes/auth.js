var express = require('express');
var router = express.Router();

const AuthController = require('../controllers/AuthController');

/* GET home page. */
router.get('/login', AuthController.getLogin);

router.post('/login', AuthController.postLogin);

router.get('/logout', AuthController.getLogout);

module.exports = router;
