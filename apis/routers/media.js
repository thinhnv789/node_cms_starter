var express = require('express');
var router = express.Router();
var MediaController = require('./../controllers/MediaController');

/* API upload image */
router.post('/upload-image', MediaController.postUploadImage);

/* API froala editor upload image */
router.post('/froala-upload-image/:folder', MediaController.postFroalaUploadImage);

/* API froala editor load images */
router.get('/froala-load-images/:folder', MediaController.getFroalaLoadImages);

module.exports = router;
