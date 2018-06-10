var express = require('express');
var router = express.Router();

const RoleController = require('../controllers/RoleController');

const middleware = require('../middleware/appMiddleware');

/* GET news categories page. */
router.get('/', middleware.isAuthenticated, RoleController.getIndex);

router.get('/search', middleware.isAuthenticated, RoleController.getSearch);

router.get('/create', middleware.isAuthenticated, RoleController.getCreate);

router.post('/create', middleware.isAuthenticated, RoleController.postCreate);

router.get('/edit/:roleId', middleware.isAuthenticated, RoleController.getEdit);

router.post('/update/:roleId', middleware.isAuthenticated, RoleController.postUpdate);

router.get('/delete/:roleId', middleware.isAuthenticated, RoleController.getDelete);

module.exports = router;
