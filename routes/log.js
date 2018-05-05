var express = require('express');
var router = express.Router();

const LogController = require('../controllers/LogController');

const middleware = require('../middleware/appMiddleware');

/* GET account page. */
router.get('/', middleware.isAuthenticated, LogController.getIndex);

router.get('/search', middleware.isAuthenticated, LogController.getSearch);

// router.get('/delete/:loginId', passport.isAuthenticated, LoginManagerController.getDelete);

module.exports = router;
