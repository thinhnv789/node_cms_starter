const async = require('async');
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
        RoleModel.find({}).exec((err, roles) => {
            res.render('role/index', {
                title: 'Vai trò',
                current: 'role',
                data: roles
            });
        })
    } catch (e) {
       next(e);
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
exports.getCreate = async (req, res, next) => {
    try {
        let permissions = await PermissionModel.find({status: 1});
        console.log('permissions', permissions);
        res.render('role/create', {
            title: 'Thêm vai trò',
            current: 'role',
            permissions: permissions
        });
    } catch (e) {
       
    }
}

exports.postCreate = (req, res, next) => {
    try {
        req.checkBody('roleName', 'Enter Role Name').notEmpty();
        req.getValidationResult().then(function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.mapped();

                PermissionModele.find({}).exec((err, permissions) => {
                    res.render('role/create', {
                        title: 'Thêm vai trò',
                        errors: errors,
                        data: req.body,
                        permissions: permissions
                    });
                });
            } else {
                try {
                    let postData = {
                        roleName: req.body.roleName || null,
                        status: req.body.status || 0,
                        permissions: req.body.permissions || [],
                        createdBy: req.session.user._id
                    }
                    let newRecord = new RoleModel(postData);
                    newRecord.save((err, result) => {
                        if (err) {
                            console.log('err', err);
                            req.flash('errors', 'Có lỗi xảy ra. Vui lòng thử lại' + JSON.stringify(err));
                            return res.redirect('/role');
                        }
                        req.flash('success', 'Đã thêm vai trò thành công');
                        return res.redirect('/role');
                    });
                } catch (e) {
                    next(e);
                }
            }
        });
    } catch (e) {
       next(e);
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
        async.parallel({
            role: function(cb) {
                RoleModel.findById(req.params.roleId).exec(cb)
            },
            permissions: function(cb) {
                PermissionModel.find({status: 1}).exec(cb)
            }
        }, function(err, results) {
            res.render('role/edit', {
                title: 'Sửa thông vai trò',
                current: 'role',
                data: results.role,
                permissions: results.permissions
            });
        });
    } catch (e) {
       next(e);
    }
}

exports.postUpdate = (req, res, next) => {
    try {
        req.checkBody('roleName', 'Enter Role Name').notEmpty();
        
        req.getValidationResult().then(function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.array();
                
                req.flash('errors', errors[0].msg);
                return res.redirect('/role/edit/' + req.params.roleId);
            } else {
                try {
                    RoleModel.findById(req.params.roleId).exec((err, role) => {
                        let newData = {
                            roleName: req.body.roleName || role.roleName,
                            status: req.body.status || role.status,
                            permissions: req.body.permissions || role.permissions || [],
                            updatedBy: req.session.user._id
                        }
                        if (err) {
                            req.flash('errors', 'Có lỗi xảy ra. Cập nhật thất bại');
                            res.redirect('/role/edit/' + req.params.roleId);
                        } else {
                            role = Object.assign(role, newData);
                            role.save((err) => {
                                req.flash('success', 'Cập nhật thành công');
                                res.redirect('/role');
                            });
                        }
                    });
                } catch (e) {
                    next(e);
                }
            }
        });
    } catch (e) {
       next(e);
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