var express = require('express');
var router = express.Router();

const DashboardController = require('../controllers/DashboardController');

const passport = require('../middleware/passport');

/* GET home page. */
router.get('/', passport.isAuthenticated, DashboardController.getIndex);

router.get('/cropper', passport.isAuthenticated, DashboardController.getCropper);

router.get('/init-user', DashboardController.getInitUser);

router.get('/send-mail', DashboardController.getSendMail);

module.exports = router;
