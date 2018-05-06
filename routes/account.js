var express = require('express');
var router = express.Router();

const AccountController = require('../controllers/AccountController');

const middleware = require('../middleware/appMiddleware');

/* GET account page. */
router.get('/', middleware.isAuthenticated, AccountController.getIndex);

router.get('/search', middleware.isAuthenticated, AccountController.getSearch);

router.get('/create', middleware.isAuthenticated, AccountController.getCreate);

router.post('/create', middleware.isAuthenticated, AccountController.postCreate);

router.get('/edit/:accountId', middleware.isAuthenticated, AccountController.getEdit);

router.post('/update/:accountId', middleware.isAuthenticated, AccountController.postUpdate);

router.get('/delete/:accountId', middleware.isAuthenticated, AccountController.getDelete);

router.get('/profile', middleware.isAuthenticated, AccountController.getProfile);

router.post('/update-profile', middleware.isAuthenticated, AccountController.postUpdateProfile);

module.exports = router;
