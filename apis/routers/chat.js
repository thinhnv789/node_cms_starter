var express = require('express');
var router = express.Router();
var ChatController = require('./../controllers/ChatController');

// const passport

/* API get list chat contacts */
router.get('/contacts', ChatController.getContacts);

/* API get list chat contacts */
router.get('/search', ChatController.getSearch);

module.exports = router;
