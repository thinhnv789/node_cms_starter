var express = require('express');
var router = express.Router();

const NewsCategoryController = require('../controllers/NewsCategoryController');

const middleware = require('../middleware/appMiddleware');

/* GET news categories page. */
router.get('/', middleware.isAuthenticated, NewsCategoryController.getIndex);

router.get('/search', middleware.isAuthenticated, NewsCategoryController.getSearch);

router.get('/create', middleware.isAuthenticated, NewsCategoryController.getCreate);

router.post('/create', middleware.isAuthenticated, NewsCategoryController.postCreate);

router.get('/edit/:categoryId', middleware.isAuthenticated, NewsCategoryController.getEdit);

router.post('/update/:categoryId', middleware.isAuthenticated, NewsCategoryController.postUpdate);

router.get('/delete/:categoryId', middleware.isAuthenticated, NewsCategoryController.getDelete);

module.exports = router;
