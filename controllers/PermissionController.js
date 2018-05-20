const PermissionModel = require('./../models/Permission');
const RoleModel = require('./../models/Role');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = (req, res, next) => {
    try {
        Permission.find({}).exec((err, permissions) => {
            res.render('permission/index', {
                title: 'Quyền truy cập',
                current: 'permission',
                data: permissions
            });
        })
    } catch (e) {
       return res.redirect('404');
    }
};

exports.getSearch = (req, res, next) => {
    try {
        let params = req.query;
        let findCondition = {};

        /** Query search */
        if (params.categoryName) {
            findCondition.categoryName = new RegExp('.*' + params.categoryName + '.*', "i");
        }
        if (params.statusDisplay) {
            findCondition.status = params.statusDisplay;
        }

        NewsCategoryModel.find(findCondition).exec((err, categories) => {
            return res.json({
                success: true,
                errorCode: 0,
                data: categories
            })
        })
    } catch (e) {
        return res.json({
            success: true,
            errorCode: 0,
            data: []
        })
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getCreate = (req, res, next) => {
    try {
        res.render('permission/create', {
            title: 'Thêm quyền truy cập',
            current: 'permission',
        });
    } catch (e) {
       
    }
}

exports.postCreate = (req, res, next) => {
    try {
        req.checkBody('categoryName', 'Tên danh mục không được để trống').notEmpty();
        
        req.getValidationResult().then(function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.mapped();
    
                res.render('news-category/create', {
                    title: 'Thêm danh mục bài viết',
                    errors: errors,
                    data: req.body
                });
            } else {
                try {
                    let postData = {
                        categoryName: req.body.categoryName || null,
                        slug: req.body.slug || category.slug,
                        description: req.body.description || null,
                        status: req.body.status || 0,
                        createdBy: req.session.user._id
                    }
                    let newRecord = new NewsCategoryModel(postData);
                    newRecord.save((err, result) => {
                        if (err) {
                            console.log('err', err);
                            req.flash('errors', 'Có lỗi xảy ra. Vui lòng thử lại' + JSON.stringify(err));
                            return res.redirect('/news-category');
                        }
                        req.flash('success', 'Danh mục ' + result.categoryName + ' đã được tạo');
                        return res.redirect('/news-category');
                    });
                } catch (e) {

                }
            }
        });
    } catch (e) {
       
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getEdit = (req, res, next) => {
    try {
        NewsCategoryModel.findById(req.params.categoryId).exec((err, category) => {
            res.render('news-category/edit', {
                title: 'Sửa thông tin danh mục',
                current: 'news-category',
                data: category
            });
        });
    } catch (e) {
       
    }
}

exports.postUpdate = (req, res, next) => {
    try {
        req.checkBody('categoryName', 'Tên danh mục không được để trống').notEmpty();
        
        req.getValidationResult().then(function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.array();
                
                req.flash('errors', errors[0].msg);
                return res.redirect('/news-category/edit/' + req.params.categoryId);
            } else {
                try {
                    NewsCategoryModel.findById(req.params.categoryId).exec((err, category) => {
                        let newData = {
                            categoryName: req.body.categoryName || category.categoryName,
                            slug: req.body.slug || category.slug,
                            description: req.body.description || category.description,
                            status: req.body.status || category.status,
                            updatedBy: req.session.user._id
                        }
                        if (err) {
                            req.flash('errors', 'Có lỗi xảy ra. Cập nhật thất bại');
                            res.redirect('/news-category/edit/' + req.params.categoryId);
                        } else {
                            category = Object.assign(category, newData);
                            category.save((err) => {
                                req.flash('success', 'Cập nhật thành công');
                                res.redirect('/news-category');
                            });
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        });
    } catch (e) {
       console.log(e);
    }
}

exports.getDelete = (req, res, next) => {
    try {
        NewsCategoryModel.findById(req.params.categoryId).exec((err, category) => {
            if (err || !category) {
                req.flash('errors', 'Danh mục không tồn tại');
                return res.redirect('/news-category');
            }
            category.remove((err) => {
                req.flash('success', 'Xóa danh mục thành công');
                return res.redirect('/news-category');
            });
        })
    } catch (e) {
        req.flash('errors', 'Có lỗi xảy ra');
        return res.redirect('/news-category');
    }
}