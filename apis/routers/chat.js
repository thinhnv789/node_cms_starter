var express = require('express');
var router = express.Router();
var ChatController = require('./../controllers/ChatController');

const apiMiddleware = require('./../../middleware/apiMiddleware');

/* API get list chat contacts */
router.get('/contacts', apiMiddleware.isAuthenticated, ChatController.getContacts);

/* API get list chat contacts */
router.get('/search', apiMiddleware.isAuthenticated, ChatController.getSearch);

/* API get list messages */
router.get('/messages/:partnerId', apiMiddleware.isAuthenticated, ChatController.getMessages);

/* API get list recent messages */
router.get('/recent-messages', apiMiddleware.isAuthenticated, ChatController.getRecentMessages);

module.exports = router;
