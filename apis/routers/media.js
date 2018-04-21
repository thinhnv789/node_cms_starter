var express = require('express');
var router = express.Router();
var MediaController = require('./../controllers/MediaController');

/* API upload image */
router.post('/upload-image', MediaController.postUploadImage);

module.exports = router;
