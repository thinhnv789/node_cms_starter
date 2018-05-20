var express = require('express');
var router = express.Router();

const PermissionController = require('../controllers/PermissionController');

const middleware = require('../middleware/appMiddleware');

/* GET news categories page. */
router.get('/', middleware.isAuthenticated, PermissionController.getIndex);

router.get('/search', middleware.isAuthenticated, PermissionController.getSearch);

router.get('/create', middleware.isAuthenticated, PermissionController.getCreate);

router.post('/create', middleware.isAuthenticated, PermissionController.postCreate);

router.get('/edit/:permissionId', middleware.isAuthenticated, PermissionController.getEdit);

router.post('/update/:permissionId', middleware.isAuthenticated, PermissionController.postUpdate);

router.get('/delete/:permissionId', middleware.isAuthenticated, PermissionController.getDelete);

module.exports = router;
