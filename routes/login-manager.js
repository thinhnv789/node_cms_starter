var express = require('express');
var router = express.Router();

const LoginManagerController = require('../controllers/LoginManagerController');

const middleware = require('../middleware/appMiddleware');

/* GET account page. */
router.get('/', middleware.isAuthenticated, LoginManagerController.getIndex);

router.get('/search', middleware.isAuthenticated, LoginManagerController.getSearch);

router.get('/delete/:loginId', middleware.isAuthenticated, LoginManagerController.getDelete);

module.exports = router;
