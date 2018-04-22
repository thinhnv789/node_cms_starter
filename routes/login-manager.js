var express = require('express');
var router = express.Router();

const LoginManagerController = require('../controllers/LoginManagerController');

const passport = require('../middleware/passport');

/* GET account page. */
router.get('/', passport.isAuthenticated, LoginManagerController.getIndex);

router.get('/search', passport.isAuthenticated, LoginManagerController.getSearch);

router.get('/delete/:loginId', passport.isAuthenticated, LoginManagerController.getDelete);

module.exports = router;
