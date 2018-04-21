const UserModel = require('./../models/User');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = (req, res, next) => {
    try {
        UserModel.find({}).exec((err, users) => {
            res.render('account/index', {
                data: users
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
        // if (params.firstName) {
        //     findCondition.firstName = new RegExp('.*' + params.firstName + '.*', "i");
        // }
        // if (params.lastName) {
        //     findCondition.lastName = new RegExp('.*' + params.lastName + '.*', "i");
        // }
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

        UserModel.find(findCondition).exec((err, users) => {
            return res.json({
                success: true,
                errorCode: 0,
                data: users
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
        res.render('account/create');
    } catch (e) {
       
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
        UserModel.findById(req.params.accountId).exec((err, account) => {
            res.render('account/edit', {
                data: account
            });
        });
    } catch (e) {
       
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
        
        req.getValidationResult().then(function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.array();
                
                req.flash('errors', errors[0].msg);
                return res.redirect('/account/edit/' + req.params.accountId);
            } else {
                try {
                    let newData = {
                        firstName: req.body.firstName || null,
                        lastName: req.body.lastName || null,
                        userName: req.body.userName || null,
                        email: req.body.email || null,
                        avatar: req.body.avatar || null,
                        status: req.body.status || 0
                    }

                    UserModel.updateOne({_id: req.params.accountId}, newData).exec((err, result, data) => {
                        if (err) {
                            req.flash('errors', 'Có lỗi xảy ra. Cập nhật thất bại');
                            res.redirect('/account/edit/' + req.params.accountId);
                        } else {
                            req.flash('success', 'Cập nhật thành công');
                            res.redirect('/account');
                        }
                    });
                } catch (e) {

                }
            }
        });
    } catch (e) {
       
    }
}