const UserModel = require('./../../models/User');
const LogModel = require('./../../models/Log');

const Auth = require('../../helpers/auth');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.postLogin = (req, res, next) => {
    try {
        /**
         * Create new log
         */
        let newLog = new LogModel();
        newLog.title = 'Đăng nhập';
        newLog.ip = req.ip;
        newLog.referrer = req.get('Referrer');
        newLog.collectionRef = UserModel.collection.name;
        newLog.data = JSON.stringify(req.body);

        console.log('newLog', newLog);
        newLog.save();

        /**=== End log ===**/

        UserModel.findOne({
            userName: req.body.userName
        }, (err, user) => {
            if (err) {
                return res.json({
                    success: false,
                    errorCode: '001',
                    message: global.i18n.__('ER_QUERY_DB')
                })
            }
            if (!user) {
                return res.json({
                    success: false,
                    errorCode: '001',
                    message: global.i18n.__('ER_USER_NOT_FOUND')
                })
            } else {
                // check if password matches
                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (err) {
                        return res.json({
                            success: false,
                            errorCode: '002',
                            message: global.i18n.__('ER_WRONG_USERNAME_OR_PASSWORD')
                        })
                    }
                    if (isMatch) {
                        /**
                         * Using json web token gen token for client
                         */
                        var token = Auth.jwtCreateToken({
                            userId: user.id
                        }, 30 * 24 * 60 * 60)//30 * 24 * 60 * 60); // Expires in 30 days
                        
                        // req.session.token = user;

                        if (global.io) {
                            global.io.sockets.emit('member_login', user.fullName + ' đã đăng nhập');
                        }
                        
                        res.json({
                            success: true,
                            errorCode: 0,
                            data: {
                                token: token
                            },
                            message: global.i18n.__('LOGIN_SUCCESSFULLY')
                        })
                    } else {
                        return res.json({
                            success: false,
                            errorCode: '003',
                            message: global.i18n.__('ER_WRONG_USERNAME_OR_PASSWORD')
                        })
                    }
                })
            }
        })
    } catch (e) {
        return res.json({
            success: false,
            errorCode: '111',
            message: 'Server has exception'
        })
    }
}

exports.getLogout = (req, res, next) => {
   return res.json({
       success: true,
       errorCode: 0,
       message: 'Logout successfully'
   })
}