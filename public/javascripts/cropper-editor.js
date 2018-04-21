
class CropperEditor {
    constructor(config) {
        this.config = config;
        /**
         * Selector input file
         */
        this.selector = document.querySelector(this.config.selector);
        /**
         * Init popup cropper editor
         */
        if (this.selector) {
            this.config.name = this.selector.getAttribute('name');
            this.customFileUpload = this.customFileUpload();
            this.cropperInput = this.genCropperInput();
            this.initImageCrop();

            /* Gen thumbpreview */
            let imgValue = this.selector.getAttribute('value'),
            imgSrc = this.selector.getAttribute('imgSrc');
            if (imgValue) {
                /* Create thumb preview */
                let thumbPreview = this.genThumbPreview(imgSrc, imgValue);
                this.customFileUpload.parentNode.insertBefore(thumbPreview, this.customFileUpload);
            }
        }
    }

    /**
     * Custom file upload
     */
    customFileUpload() {
        let customFileUpload = document.createElement('label');
        customFileUpload.className = 'custom-file-upload';
        this.selector.style = 'display: none';
        this.selector.parentNode.insertBefore(customFileUpload, this.selector.nextSibling);
        customFileUpload.onclick = function() {
            this.selector.click();
        }.bind(this);

        let uploadFileIcon = document.createElement('i');
        uploadFileIcon.className = 'fa fa-cloud-upload';
        customFileUpload.appendChild(uploadFileIcon);

        if (this.selector.getAttribute('value')) {
            customFileUpload.style = 'display: none';
        }

        return customFileUpload;
    }

    genCropperInput() {
        let cropperInputImage = document.createElement('input');
        cropperInputImage.name = this.config.name;
        cropperInputImage.id = 'cropper-input-' + this.config.name;
        cropperInputImage.className = 'cropper-input';
        cropperInputImage.type = 'text';

        if (this.config.isMultiple) {
            cropperInputImage.value = JSON.stringify([]);
        } else {
            cropperInputImage.value = this.selector.getAttribute('value') || '';
        }
        this.selector.parentNode.insertBefore(cropperInputImage, this.selector.nextSibling);
        this.selector.name = this.config.name + '-disabled';

        return cropperInputImage;
    }

    createToolbar() {
        /**
         * Toolbar buttons
         */
        let mainToolbar = document.createElement('div');
        mainToolbar.className = 'main-cropper-editor-toolbar';

        let toolbar = document.createElement('div');
        toolbar.className = 'cropper-editor-toolbar';

        let toolbars = this.config.toolbars;
        if (toolbars) {
            /**
             * Button crop
             */
            if (toolbars.crop) {
                let icon = document.createElement('i');
                icon.className = 'fa fa-crop';

                let cropBtn = document.createElement('button');
                cropBtn.type = 'button';
                cropBtn.className = 'toolbar-button';

                cropBtn.appendChild(icon);
                toolbar.appendChild(cropBtn);
            }
            /**
             * Button zoomIn
             */
            if (toolbars.zoomIn) {
                let icon = document.createElement('i');
                icon.className = 'fa fa-search-plus';

                let zoomInBtn = document.createElement('button');
                zoomInBtn.type = 'button';
                zoomInBtn.className = 'toolbar-button';

                zoomInBtn.appendChild(icon);
                toolbar.appendChild(zoomInBtn);
            }
            /**
             * Button zoomIn
             */
            if (toolbars.zoomOut) {
                let icon = document.createElement('i');
                icon.className = 'fa fa-search-minus';

                let zoomOutBtn = document.createElement('button');
                zoomOutBtn.type = 'button';
                zoomOutBtn.className = 'toolbar-button';

                zoomOutBtn.appendChild(icon);
                toolbar.appendChild(zoomOutBtn);
            }
        }

        /**
         * Button submit: always exist
         */
        let icon = document.createElement('i');
        icon.className = 'fa fa-check';

        let submitCrop = document.createElement('button');
        submitCrop.type = 'button';
        submitCrop.className = 'toolbar-button submit-crop';
        submitCrop.onclick = function() {
            this.submitCrop();
        }.bind(this);

        submitCrop.appendChild(icon);
        toolbar.appendChild(submitCrop);
        mainToolbar.appendChild(toolbar);

        return mainToolbar;
    }

    createLoading() {
        let loading = document.createElement('div');
        loading.id = 'cropper-loading-' + this.config.name;
        loading.className = 'cropper-loading';
        loading.style.display = 'none';

        let fountainG = document.createElement('div');
        fountainG.id = 'fountainG-' + this.config.name;
        fountainG.className = 'fountainG-loading';

        let loadingItem;
        loadingItem = document.createElement('div');
        loadingItem.id = 'fountainG_1';
        loadingItem.className = 'fountainG';
        fountainG.appendChild(loadingItem);

        loadingItem = document.createElement('div');
        loadingItem.id = 'fountainG_2';
        loadingItem.className = 'fountainG';
        fountainG.appendChild(loadingItem);
        
        loadingItem = document.createElement('div');
        loadingItem.id = 'fountainG_3';
        loadingItem.className = 'fountainG';
        fountainG.appendChild(loadingItem);

        loadingItem = document.createElement('div');
        loadingItem.id = 'fountainG_4';
        loadingItem.className = 'fountainG';
        fountainG.appendChild(loadingItem);

        loadingItem = document.createElement('div');
        loadingItem.id = 'fountainG_5';
        loadingItem.className = 'fountainG';
        fountainG.appendChild(loadingItem);

        loadingItem = document.createElement('div');
        loadingItem.id = 'fountainG_6';
        loadingItem.className = 'fountainG';
        fountainG.appendChild(loadingItem);

        loading.appendChild(fountainG);

        return loading;
    }

    /**
     * Function init popup
     */
    initImageCrop() {
        this.selector.addEventListener('change', function(e) {
            this.readURL(e.target);
        }.bind(this));
    }

    /**
     * Event on input change
     */
    readURL(input) {
       
        if (input.files && input.files.length) {
            let file = input.files[0];

            if (/^image\/\w+/.test(file.type)) {
                this.imageType = file.type;
                let URL = window.URL || window.webkitURL;

                let cropperEditor = document.createElement('div');
                cropperEditor.className = 'cropper-editor cropper-editor-popup';
                cropperEditor.id = 'cropper-editor-' + this.config.name;
                this.customFileUpload.parentNode.insertBefore(cropperEditor, this.customFileUpload.nextSibling);

                let cropperEditorContainer = document.createElement('div');
                cropperEditorContainer.className = 'cropper-editor-container cropper-editor-popup-container';
                cropperEditor.appendChild(cropperEditorContainer);

                let cropperEditorMain = document.createElement('div');
                cropperEditorMain.className = 'cropper-editor-main';
                cropperEditorContainer.appendChild(cropperEditorMain);

                /**
                 * Create toolbar
                 */
                let toolbar = this.createToolbar();
                cropperEditorMain.appendChild(toolbar);

                /**
                 * Create loading 
                 */
                let loading = this.createLoading();

                cropperEditorMain.appendChild(loading);

                let imageCrop = document.createElement('img');
                imageCrop.id = 'image-crop-' + this.config.name;
                imageCrop.className = 'image-crop'
                imageCrop.src = URL.createObjectURL(file);
                cropperEditorMain.appendChild(imageCrop);

                this.cropperEditor = cropperEditor;
                this.initCropper(this.config.clientOptions);
            } else {
                window.alert('Please choose an image file.');
            }
        }
    }

    /**
     * Init cropper using cropperjs lib
     */
    initCropper(config) {
        var imageCrop = document.getElementById('image-crop-' + this.config.name);
        // Destroy cropper before init
        if (this.cropper) {
          this.cropper.destroy();
        }
        this.cropper = new Cropper(imageCrop, config);
    };

    /**
     * Submit crop
     */
    submitCrop() {
        //Show loading
        let loadingEl = document.querySelector('#cropper-editor-' + this.config.name + ' .cropper-loading');
        let toolbarEl = document.querySelector('#cropper-editor-' + this.config.name + ' .main-cropper-editor-toolbar');
        toolbarEl.style = 'display: none';
        loadingEl.style = 'display: block';
        //Submit data
        this.cropper.getCroppedCanvas().toBlob(function (blob) {
            console.log('data', blob);
            var formData = new FormData();
            formData.append('imageData', blob);
            formData.append('imageType', this.imageType);
            formData.append('uploadDir', this.config.uploadDir);
            formData.append('prefixFileName', this.config.prefixFileName);
            formData.append('thumbWidth', this.config.thumbWidth);
            formData.append('thumbHeight', this.config.thumbHeight);
           
            /**
             * Post data form to server using http
             */
            var xhr = new XMLHttpRequest();
            xhr.open('POST', this.config.upload_url, true);
            xhr.onload = function (response) {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    let dataRes = JSON.parse(xhr.responseText);
                    if (dataRes.success) {
                        console.log('dataRes', dataRes);

                        /* Reset value */
                        this.selector.value = '';

                        /* Create thumb preview */
                        let thumbPreview = this.genThumbPreview(dataRes.data.url, dataRes.data.fileName);
                        this.customFileUpload.parentNode.insertBefore(thumbPreview, this.customFileUpload);

                        /* Remove cropper popup */
                        this.cropperEditor.remove();

                        /*
                        * If allow upload one image => hide icon upload
                        */
                        if (!this.config.isMultiple) {
                            this.customFileUpload.style = 'display: none';
                        }
                    }
                }
            }.bind(this);

            xhr.send(formData);
        }.bind(this));     
    }

    createThumbPreviewItem(url, fileName) {
        let thumbPreviewItem = document.createElement('div');
        thumbPreviewItem.className = 'thumb-preview-item';

        let imgEl = document.createElement('img');
        imgEl.src = url;
        thumbPreviewItem.appendChild(imgEl);

        let deleteImg = document.createElement('div');
        deleteImg.className = 'delete-image';
        deleteImg.onclick = function() {
            deleteImg.parentNode.remove();
            if (this.config.isMultiple) {
                let value = JSON.parse(this.cropperInput.value);
                let newValue = [];
        
                for (let i=0; i<value.length; i++) {
                    if (value[i] !== fileName) {
                        newValue.push(value[i]);
                    }
                }
                this.cropperInput.value = JSON.stringify(newValue);
            } else {
                this.cropperInput.value = '';
                this.customFileUpload.style = 'display: inline-block';
            }
        }.bind(this);
        thumbPreviewItem.appendChild(deleteImg);

        let deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa fa-trash';
        deleteImg.appendChild(deleteIcon);

        if (this.config.isMultiple) {
            let value = this.cropperInput.value;
    
            if (!value) {
                value = [];
                value.push(fileName);
                this.cropperInput.value = JSON.stringify(value);
            } else {
                value = JSON.parse(value);
                value.push(fileName);
                this.cropperInput.value = JSON.stringify(value);
            }
        } else {
            this.cropperInput.value = fileName;
        }

        return thumbPreviewItem;
    }

    genThumbPreview(imageUrl, fileName) {
        let thumbPreview = document.getElementById('cropper-thumb-preview-' + this.config.name);

        let thumbPreviewItem = this.createThumbPreviewItem(imageUrl, fileName);
        if (thumbPreview) {
            thumbPreview.appendChild(thumbPreviewItem);
        } else {
            thumbPreview = document.createElement('div');
            thumbPreview.id = 'cropper-thumb-preview-' + this.config.name;
            thumbPreview.className = 'cropper-thumb-preview';
            thumbPreview.appendChild(thumbPreviewItem);
        }

        return thumbPreview;
    }
}

// let cropperEditor = new CropperEditor({
//     selector: '#cropper-image',
//     upload_url: '/api/media/upload-image',
//     uploadDir: '/images/test',
//     prefixFileName: 'test',
//     isMultiple: true,
//     thumbWidth: 400,
//     thumbHeight: 400,
//     clientOptions: {
//         viewMode: 1,
//         dragMode: 'move',
//         cropBoxResizable: false
//     }
// });

// let cropperEditor1 = new CropperEditor({
//     selector: '#cropper-image1',
//     upload_url: '/api/media/upload-image',
//     uploadDir: '/images/test',
//     prefixFileName: 'test',
//     isMultiple: false,
//     thumbWidth: 400,
//     thumbHeight: 400,
//     clientOptions: {
//         viewMode: 1,
//         dragMode: 'move',
//         cropBoxResizable: false
//     }
// });