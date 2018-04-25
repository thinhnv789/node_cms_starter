var express = require('express');
var router = express.Router();

const LogController = require('../controllers/LogController');

const passport = require('../middleware/passport');

/* GET account page. */
router.get('/', passport.isAuthenticated, LogController.getIndex);

router.get('/search', passport.isAuthenticated, LogController.getSearch);

// router.get('/delete/:loginId', passport.isAuthenticated, LoginManagerController.getDelete);

module.exports = router;
