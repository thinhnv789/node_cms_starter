var express = require('express');
var router = express.Router();

const DashboardController = require('../controllers/DashboardController');

const middleware = require('../middleware/appMiddleware');

/* GET home page. */
router.get('/', middleware.isAuthenticated, DashboardController.getIndex);

router.get('/cropper', middleware.isAuthenticated, DashboardController.getCropper);

router.get('/init-user', DashboardController.getInitUser);

router.get('/send-mail', DashboardController.getSendMail);

module.exports = router;
