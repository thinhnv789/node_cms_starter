/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.postUploadImage = (req, res, next) => {
    try {
        const fs = require('fs'),
            path = require('path'),
            readChunk = require('read-chunk'),
            fileType = require('file-type'),
            sharp = require('sharp'),
            formidable = require('formidable'),
            form = new formidable.IncomingForm();
        
            form.multiples = true;
        
        let uploadDir = '/media', uploadPath = '',
            prefixFileName = 'default',
            imageType = 'image/png',
            thumbWidth = 100,
            thumbHeight = 100;

        
        form.on('field', function(name, value) {
            switch (name) {
                case 'uploadDir':
                    uploadPath = value;
                    break;
                case 'prefixFileName':
                    prefixFileName = value;
                    break;
                case 'imageType':
                    imageType = value;
                    break;
                case 'thumbWidth':
                    thumbWidth = Math.round(value);
                    break;
                case 'thumbHeight':
                    thumbHeight = Math.round(value);
                    break;
                default:
                    break;
            }
        });

        form.on('file', function (name, file) {
            uploadDir += uploadPath;
            let uploadDirOrigin = uploadDir + '/origin';
            let uploadDirThumb = uploadDir + '/thumb';

            let dirs = uploadDir.split('/'), dir='.';

            for (let i=0; i<dirs.length; i++) {
                if (dirs[i]) {
                    dir += '/' + dirs[i];
                    if (!fs.existsSync(dir)){
                        fs.mkdirSync(dir);
                    }
                }
            }

            /* Create origin folder */
            let originDir = dir + '/origin';
            if (!fs.existsSync(originDir)){
                fs.mkdirSync(originDir);
            }
            /* Create thumb folder */
            let thumbDir = dir + '/thumb';
            if (!fs.existsSync(thumbDir)){
                fs.mkdirSync(thumbDir);
            }

            /**
             * Save file
             */
            let ext = imageType.split('/')[1];

            // Check the file type, must be either png,jpg or jpeg
            if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
                // Assign new file name
                let fileName = prefixFileName + '-' + Date.now() + '.' + ext;

                // Upload origin image
                sharp(file.path).toFile('./' + uploadDirOrigin + '/' + fileName, (err, info) => {});
                // Upload thumb image
                sharp(file.path).resize(thumbWidth, thumbHeight).ignoreAspectRatio().toFile('./' + uploadDirThumb + '/' + fileName, (err, info) => {
                    // Response 
                    res.status(200).end(JSON.stringify({
                        success: true,
                        errorCode: 0,
                        data: {
                            url: process.env.MEDIA_URL + uploadPath + '/thumb/' + fileName,
                            fileName: fileName
                        }
                    }));
                });
            }
        });

        form.parse(req);
    } catch (e) {
        return res.json({
            success: false,
            errorCode: '111',
            message: 'Upload failed' + JSON.stringify(e)
        })
    }
}

// Upload image
exports.postFroalaUploadImage = (req, res, next) => {
    let folder = req.params.folder;
    let uploadDir = '/media/images/froala/' + folder + '/';
	const fs = require('fs'), FroalaEditor = require('wysiwyg-editor-node-sdk/lib/froalaEditor.js');
    
    /**
     * Create folder if not exist
     */
    let dirs = uploadDir.split('/'), dir='.';

    for (let i=0; i<dirs.length; i++) {
        if (dirs[i]) {
            dir += '/' + dirs[i];
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
        }
    }
    
    // Store image.
    FroalaEditor.Image.upload(req, '..' + uploadDir, function(err, data) {
        // Return data.
        if (err) {
            return res.send(JSON.stringify(err));
        }
        try {
            data.link = data.link.replace('../media', process.env.MEDIA_URL);
        } catch (e) {
            
        }
        res.send(data);
    });
}

// Get all images from folder
exports.getFroalaLoadImages = (req, res, next) => {
    let folder = req.params.folder;
	const imageFolder = './media/images/froala/' + folder + '/';
	const fs = require('fs');

	let data = [];
	
	fs.readdir(imageFolder, (err, files) => {
		files.forEach(file => {
			data.push({
				url: process.env.MEDIA_URL + '/images/froala/' + folder + '/' + file,
				thumb: process.env.MEDIA_URL + '/images/froala/' + folder + '/' + file,
				tag: file
			})
		});
		res.send(data);
	})
}