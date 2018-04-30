var express = require('express');
var router = express.Router();
var ChatController = require('./../controllers/ChatController');

const passport = require('./../../middleware/apiPassport');

/* API get list chat contacts */
router.get('/contacts', passport.isAuthenticated, ChatController.getContacts);

/* API get list chat contacts */
router.get('/search', passport.isAuthenticated, ChatController.getSearch);

/* API get list messages */
router.get('/messages/:partnerId', passport.isAuthenticated, ChatController.getMessages);

module.exports = router;
