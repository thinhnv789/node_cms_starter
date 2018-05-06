var express = require('express');
var router = express.Router();

const GroupChatController = require('../controllers/GroupChatController');

const middleware = require('../middleware/appMiddleware');

/* GET news page. */
router.get('/', middleware.isAuthenticated, GroupChatController.getIndex);

router.get('/search', middleware.isAuthenticated, GroupChatController.getSearch);

router.get('/create', middleware.isAuthenticated, GroupChatController.getCreate);

router.post('/create', middleware.isAuthenticated, GroupChatController.postCreate);

router.get('/edit/:groupId', middleware.isAuthenticated, GroupChatController.getEdit);

router.post('/update/:groupId', middleware.isAuthenticated, GroupChatController.postUpdate);

router.get('/view/:groupId', middleware.isAuthenticated, GroupChatController.getView);

router.post('/:groupId/add-member', middleware.isAuthenticated, GroupChatController.postAddMember);

router.get('/:groupId/add-admin/:memberId', middleware.isAuthenticated, GroupChatController.getAddAdmin);

router.get('/:groupId/remove-admin/:memberId', middleware.isAuthenticated, GroupChatController.getRemoveAdmin);

router.get('/:groupId/add-blacklist/:memberId', middleware.isAuthenticated, GroupChatController.getAddBlackList);

router.get('/:groupId/remove-blacklist/:memberId', middleware.isAuthenticated, GroupChatController.getRemoveBlackList);

router.get('/delete/:groupId', middleware.isAuthenticated, GroupChatController.getDelete);

module.exports = router;
