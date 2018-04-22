const UserModel = require('./../models/User');
const SessionModel = require('./../models/Session');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = (req, res, next) => {
    global.io.sockets.emit('hello', 'hello ttt');

    try {
        res.render('dashboard/index', {
            title: 'Hệ thống quản trị - Dashboard',
            current: 'dashboard'
        });
    } catch (e) {
       
    }
};

exports.getCropper = (req, res, next) => {
    try {
        res.render('dashboard/cropper');
    } catch (e) {
       
    }
}

exports.getInitUser = (req, res, next) => {
    try {
        let newUser = new UserModel();
        newUser.firstName = 'Nguyen Viet';
        newUser.lastName = 'Thinh';
        newUser.userName = 'admin';
        newUser.email = 'admin@gmail.com';
        newUser.password = '123456';
        newUser.save((err) => {
            if (err) {
                return res.json(err);
            } else {
                return res.json('successfully');
            }
        })
    } catch (e) {
       
    }
};