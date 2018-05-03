const NewsCategoryModel = require('./../models/NewsCategory');

const moment = require('moment');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = (req, res, next) => {
    try {
        NewsCategoryModel.find({}).exec((err, newsCategories) => {
            res.render('news-category/index', {
                title: 'Tin tức',
                current: 'news-category',
                data: newsCategories
            });
        })
    } catch (e) {
       return res.redirect('404');
    }
};

// exports.getSearch = (req, res, next) => {
//     try {
//         let params = req.query;
//         let findCondition = {};

//         /** Query search */
//         if (params.fullName) {
//             findCondition = {
//                 $or: [
//                     {firstName: new RegExp('.*' + params.fullName + '.*', "i")},
//                     {lastName: new RegExp('.*' + params.fullName + '.*', "i")}
//                 ]
//             }
//         }
//         if (params.userName) {
//             findCondition.userName = new RegExp('.*' + params.userName + '.*', "i");
//         }
//         if (params.email) {
//             findCondition.email = new RegExp('.*' + params.email + '.*', "i");
//         }
//         if (params.statusDisplay) {
//             findCondition.status = params.statusDisplay;
//         }

//         UserModel.find(findCondition).exec((err, users) => {
//             return res.json({
//                 success: true,
//                 errorCode: 0,
//                 data: users
//             })
//         })
//     } catch (e) {
//         return res.json({
//             success: true,
//             errorCode: 0,
//             data: []
//         })
//     }
// }

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getCreate = (req, res, next) => {
    try {
        res.render('news-category/create', {
            title: 'Thêm danh mục bài viết',
            current: 'news-category',
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
                        description: req.body.description || null,
                        status: req.body.status || 0,
                        createdBy: req.session.user._id
                    }
                    let newRecord = new NewsCategoryModel(postData);
                    newRecord.save((err, result) => {
                        if (err) {
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
        NewsModel.findById(req.params.accountId).exec((err, account) => {
            res.render('account/edit', {
                title: 'Sửa thông tin tài khoản',
                current: 'account',
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
                    console.log('req', req.body.birthDay);
                    let newData = {
                        firstName: req.body.firstName || null,
                        lastName: req.body.lastName || null,
                        userName: req.body.userName || null,
                        email: req.body.email || null,
                        avatar: req.body.avatar || null,
                        birthDay: req.body.birthDay ? moment(req.body.birthDay, 'DDMMYYYY').format() : null,
                        status: req.body.status || 0
                    }
                    console.log('tt', newData);
                    NewsModel.updateOne({_id: req.params.accountId}, newData).exec((err) => {
                        if (err) {
                            req.flash('errors', 'Có lỗi xảy ra. Cập nhật thất bại');
                            res.redirect('/account/edit/' + req.params.accountId);
                        } else {
                            req.flash('success', 'Cập nhật thành công');
                            res.redirect('/account');
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

// exports.getDelete = (req, res, next) => {
//     try {
//         UserModel.deleteOne({_id: req.params.accountId}).exec((err) => {
//             if (err) {
//                 req.flash('errors', 'Tài khoản không tồn tại');
//                 return res.redirect('/account');
//             }
//             req.flash('success', 'Xóa tài khoản thành công');
//             return res.redirect('/account');
//         })
//     } catch (e) {
//         req.flash('errors', 'Có lỗi xảy ra');
//         return res.redirect('/account');
//     }
// }