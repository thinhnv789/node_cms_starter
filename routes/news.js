var express = require('express');
var router = express.Router();

const NewsController = require('../controllers/NewsController');

const passport = require('../middleware/passport');

/* GET news page. */
router.get('/', passport.isAuthenticated, NewsController.getIndex);

// router.get('/search', passport.isAuthenticated, NewsController.getSearch);

router.get('/create', passport.isAuthenticated, NewsController.getCreate);

router.post('/create', passport.isAuthenticated, NewsController.postCreate);

// router.get('/edit/:accountId', passport.isAuthenticated, NewsController.getEdit);

// router.post('/update/:accountId', passport.isAuthenticated, NewsController.postUpdate);

// router.get('/delete/:accountId', passport.isAuthenticated, NewsController.getDelete);

module.exports = router;
