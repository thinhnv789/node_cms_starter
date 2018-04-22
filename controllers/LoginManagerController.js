const Session = require('./../models/Session');
const LoginManager = require('./../models/LoginManager');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = (req, res, next) => {
    try {
        LoginManager.find({}).sort('-createdAt').exec((err, data) => {
            res.render('login-manager/index', {
                title: 'Quản lý thiết bị',
                current: 'login-manager',
                data: data
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

        LoginManager.find(findCondition).exec((err, data) => {
            return res.json({
                success: true,
                errorCode: 0,
                data: data
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

exports.getDelete = (req, res, next) => {
    try {
        LoginManager.findOne({_id: req.params.loginId}).exec((err, login) => {
            if (login) {
                Session.findOne({_id: login.sessionId}).exec((err, session) => {
                    // console.log('session', session)
                    if (session) {
                        if (session._id === req.sessionID) {
                            req.session.destroy();
                            login.remove((err) => {
                                res.redirect('/');
                            });
                        } else {
                            session.remove((err, s) => {
                                login.remove((err) => {
                                    req.flash('success', 'Xóa thành công');
                                    res.redirect('/login-manager');
                                });
                            })
                        }
                    } else {
                        login.remove((err) => {
                            req.flash('errors', 'Không tìm thấy session đăng nhập.');
                            res.redirect('/login-manager');
                        });
                    }
                })
            } else {
                req.flash('success', 'Không tìm thấy dữ liệu');
                res.redirect('/login-manager');
            }
        })
    } catch (e) {
        req.flash('errors', 'Có lỗi xảy ra');
        return res.redirect('/login-manager');
    }
}