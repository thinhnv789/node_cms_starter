var express = require('express');
var router = express.Router();

const AccountController = require('../controllers/AccountController');

const passport = require('../middleware/passport');

/* GET account page. */
router.get('/', passport.isAuthenticated, AccountController.getIndex);

router.get('/search', passport.isAuthenticated, AccountController.getSearch);

router.get('/create', passport.isAuthenticated, AccountController.getCreate);

router.post('/create', passport.isAuthenticated, AccountController.postCreate);

router.get('/edit/:accountId', passport.isAuthenticated, AccountController.getEdit);

router.post('/update/:accountId', passport.isAuthenticated, AccountController.postUpdate);

router.get('/delete/:accountId', passport.isAuthenticated, AccountController.getDelete);

module.exports = router;
