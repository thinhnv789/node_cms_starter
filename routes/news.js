var express = require('express');
var router = express.Router();

const NewsController = require('../controllers/NewsController');

const middleware = require('../middleware/appMiddleware');

/* GET news page. */
router.get('/', middleware.isAuthenticated, NewsController.getIndex);

router.get('/search', middleware.isAuthenticated, NewsController.getSearch);

router.get('/create', middleware.isAuthenticated, NewsController.getCreate);

router.post('/create', middleware.isAuthenticated, NewsController.postCreate);

router.get('/edit/:newsId', middleware.isAuthenticated, NewsController.getEdit);

router.post('/update/:newsId', middleware.isAuthenticated, NewsController.postUpdate);

router.get('/delete/:newsId', middleware.isAuthenticated, NewsController.getDelete);

module.exports = router;
