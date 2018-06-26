const async = require('async');
const UserModel = require('./../models/User');
const RoleModel = require('./../models/Role');
const PermissionModel = require('./../models/Permission');

const moment = require('moment');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = async (req, res, next) => {
    try {
        let page = parseInt(process.env.DEFAULT_PAGE, 10),
            queryPage = parseInt(req.query.page, 10),
            pageSize = parseInt(process.env.DEFAULT_PAGESIZE, 10),
            queryPageSize = parseInt(req.query.pageSize);

        if (queryPage && queryPage > 0) {
            page = queryPage;
        }
        if (queryPageSize && queryPageSize > 0) {
            pageSize = queryPageSize;
        }

        let users = await UserModel.find({}).sort('-createdAt').skip((page - 1) * pageSize).limit(pageSize);
        let total = await UserModel.count({});

        res.render('account/index', {
            title: 'Danh sách tài khoản',
            current: 'account',
            data: users,
            pageSize: pageSize,
            total: total
        });
    } catch (e) {
       next(e);
    }
};

exports.getSearch = async (req, res, next) => {
    try {
        let page = parseInt(process.env.DEFAULT_PAGE, 10),
            queryPage = parseInt(req.query.page, 10),
            pageSize = parseInt(process.env.DEFAULT_PAGESIZE, 10),
            queryPageSize = parseInt(req.query.pageSize);
        let params = req.query;
        let findCondition = {};

        if (queryPage && queryPage > 0) {
            page = queryPage;
        }
        if (queryPageSize && queryPageSize > 0) {
            pageSize = queryPageSize;
        }

        /** Query search */
        if (params.fullName) {
            findCondition = {
                $or: [
                    {firstName: new RegExp('.*' + params.fullName + '.*', "i")},
                    {lastName: new RegExp('.*' + params.fullName + '.*', "i")}
                ]
            }
        }
        if (params.userName) {
            findCondition.userName = new RegExp('.*' + params.userName + '.*', "i");
        }
        if (params.email) {
            findCondition.email = new RegExp('.*' + params.email + '.*', "i");
        }
        if (params.statusDisplay) {
            findCondition.status = params.statusDisplay;
        }

        let users = await UserModel.find(findCondition).sort('-createdAt').skip((page - 1) * pageSize).limit(pageSize);
        let total = await UserModel.count(findCondition);
        return res.json({
            success: true,
            errorCode: 0,
            data: users,
            pageSize: pageSize,
            total: total
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
        async.parallel({
            roles: function(cb) {
                RoleModel.find({}).exec(cb)
            },
            permissions: function(cb) {
                PermissionModel.find({status: 1}).exec(cb)
            }
        }, function(err, results) {
            res.render('account/create', {
                title: 'Tạo tài khoản',
                current: 'account',
                roles: results.roles,
                permissions: results.permissions
            });
        });
    } catch (e) {
       next(e);
    }
}

exports.postCreate = (req, res, next) => {
    try {
        req.checkBody('firstName', 'Họ không được để trống').notEmpty();
        req.checkBody('lastName', 'Tên không được để trống').notEmpty();
        req.checkBody('userName', 'Tên đăng nhập không được để trống').notEmpty();
        req.checkBody('email', 'Email không được để trống').notEmpty();
        req.assert('email', 'Email không đúng').isEmail();
        // req.checkBody('avatar', 'Ảnh đại diện không được để trống').notEmpty();
        req.checkBody('password', 'Mật khẩu ít nhất 6 kí tự').len(6);
        req.checkBody('confirmPassword', 'Mật khẩu không trùng khớp').equals(req.body.password);
        req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
        
        req.getValidationResult().then(function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.mapped();
    
                res.render('account/create', {
                    title: 'Tạo tài khoản',
                    errors: errors,
                    data: req.body
                });
            } else {
                try {
                    let postData = {
                        firstName: req.body.firstName || null,
                        lastName: req.body.lastName || null,
                        userName: req.body.userName || null,
                        email: req.body.email || null,
                        avatar: req.body.avatar || null,
                        birthDay: req.body.birthDay ? moment(req.body.birthDay, 'DDMMYYYY').format() : null,
                        roles: req.body.roles || [],
                        permissions: req.body.permissions || [],
                        password: req.body.password || null,
                        status: req.body.status || 0
                    }
                    
                    let newRecord = new UserModel(postData);
                    newRecord.save((err, result) => {
                        if (err) {
                            req.flash('errors', 'Có lỗi xảy ra. Vui lòng thử lại');
                            return res.redirect('/account');
                        }
                        req.flash('success', 'Tài khoản ' + result.email + ' đã được tạo');
                        return res.redirect('/account');
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
        async.parallel({
            account: function(cb) {
                UserModel.findById(req.params.accountId).exec(cb)
            },
            roles: function(cb) {
                RoleModel.find({}).exec(cb)
            },
            permissions: function(cb) {
                PermissionModel.find({status: 1}).exec(cb)
            }
        }, function(err, results) {
            res.render('account/edit', {
                title: 'Sửa thông tin tài khoản',
                current: 'account',
                data: results.account,
                roles: results.roles,
                permissions: results.permissions
            });
        });
    } catch (e) {
       next(e);
    }
}

exports.postUpdate = (req, res, next) => {
    try {
        req.checkBody('firstName', 'Họ không được để trống').notEmpty();
        req.checkBody('lastName', 'Tên không được để trống').notEmpty();
        req.checkBody('userName', 'Tên đăng nhập không được để trống').notEmpty();
        req.checkBody('email', 'Email không được để trống').notEmpty();
        req.assert('email', 'Email không đúng').isEmail();
        req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

        console.log('roles', req.body.roles);
        
        req.getValidationResult().then(function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.array();
                
                req.flash('errors', errors[0].msg);
                return res.redirect('/account/edit/' + req.params.accountId);
            } else {
                try {
                    console.log('req', req.body.birthDay);
                    UserModel.findById({_id: req.params.accountId}).exec((err, user) => {
                        if (err) {
                            req.flash('errors', 'Có lỗi xảy ra. Cập nhật thất bại');
                            res.redirect('/account/edit/' + req.params.accountId);
                        } else {
                            let newData = {
                                firstName: req.body.firstName || user.firstName,
                                lastName: req.body.lastName || user.lastName,
                                userName: req.body.userName || user.userName,
                                email: req.body.email || user.email,
                                avatar: req.body.avatar || user.avatar,
                                birthDay: req.body.birthDay ? moment(req.body.birthDay, 'DDMMYYYY').format() : user.birthDay,
                                roles: req.body.roles || user.roles || [],
                                permissions: req.body.permissions || user.permissions || [],
                                status: req.body.status || user.status
                            }

                            user = Object.assign(user, newData);

                            user.save((err) => {
                                if (err) {
                                    req.flash('errors', 'Có lỗi xảy ra. Cập nhật thất bại');
                                    return res.redirect('/account/edit/' + req.params.accountId);
                                }
                                req.flash('success', 'Cập nhật thành công');
                                res.redirect('/account');
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
        UserModel.deleteOne({_id: req.params.accountId}).exec((err) => {
            if (err) {
                req.flash('errors', 'Tài khoản không tồn tại');
                return res.redirect('/account');
            }
            req.flash('success', 'Xóa tài khoản thành công');
            return res.redirect('/account');
        })
    } catch (e) {
        req.flash('errors', 'Có lỗi xảy ra');
        return res.redirect('/account');
    }
}

exports.getProfile = async (req, res, next) => {
    try {
        let data = await UserModel.findById(req.session.user._id);

        if (!data) {
            req.flash('errors', 'Không tìm thấy dữ liệu');
            return res.redirect('/');
        }
        res.render('account/profile', {
            data: data
        })
    } catch (e) {
        next(e)
    }
}

exports.postUpdateProfile = (req, res, next) => {
    try {
        req.checkBody('firstName', 'Họ không được để trống').notEmpty();
        req.checkBody('lastName', 'Tên không được để trống').notEmpty();
        req.checkBody('userName', 'Tên đăng nhập không được để trống').notEmpty();
        req.checkBody('email', 'Email không được để trống').notEmpty();
        req.assert('email', 'Email không đúng').isEmail();
        req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
        
        req.getValidationResult().then(function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.array();
                
                req.flash('errors', errors[0].msg);
                return res.redirect('/account/profile');
            } else {
                try {
                    UserModel.findById(req.session.user._id).exec((err, user) => {
                        if (err || !user) {
                            req.flash('errors', 'Có lỗi xảy ra. Cập nhật thất bại');
                            res.redirect('/account/profile');
                        } else {
                            let newData = {
                                firstName: req.body.firstName || user.firstName,
                                lastName: req.body.lastName || user.lastName,
                                userName: req.body.userName || user.userName,
                                email: req.body.email || user.email,
                                avatar: req.body.avatar || user.avatar,
                                birthDay: req.body.birthDay ? moment(req.body.birthDay, 'DDMMYYYY').format() : moment(user.birthDay, 'DDMMYYYY').format(),
                                status: user.status
                            }
                            user = Object.assign(user, newData);
                            user.save((err) => {
                                req.flash('success', 'Cập nhật thành công');
                                res.redirect('/account/profile');
                            })
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