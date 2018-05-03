var express = require('express');
var router = express.Router();

const NewsCategoryController = require('../controllers/NewsCategoryController');

const passport = require('../middleware/passport');

/* GET news categories page. */
router.get('/', passport.isAuthenticated, NewsCategoryController.getIndex);

// router.get('/search', passport.isAuthenticated, NewsController.getSearch);

router.get('/create', passport.isAuthenticated, NewsCategoryController.getCreate);

router.post('/create', passport.isAuthenticated, NewsCategoryController.postCreate);

// router.get('/edit/:accountId', passport.isAuthenticated, NewsController.getEdit);

// router.post('/update/:accountId', passport.isAuthenticated, NewsController.postUpdate);

// router.get('/delete/:accountId', passport.isAuthenticated, NewsController.getDelete);

module.exports = router;
