const platform = require('platform');
const dns = require('dns');

const LogModel = require('./../models/Log');
const UserModel = require('./../models/User');
const LoginManager = require('./../models/LoginManager');

const Auth = require('../helpers/auth');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getFacebook = (req, res, next) => {
    try {
        return res.send('<script>window.fbAsyncInit=function(){FB.init({appId:"100366074171779",cookie:!0,xfbml:!0,version:"v3.0"}),FB.AppEvents.logPageView()},function(e,n,t){var o,i=e.getElementsByTagName(n)[0];e.getElementById(t)||((o=e.createElement(n)).id=t,o.src="https://connect.facebook.net/en_US/sdk.js",i.parentNode.insertBefore(o,i))}(document,"script","facebook-jssdk");</script>')
    } catch (e) {
        console.log(e);
    }
}
 
exports.getLogin = (req, res, next) => {
    try {
        res.render('auth/login');
    } catch (e) {
       
    }
};

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
        }).populate({
            path: 'roles',
            model: 'Role',
            populate: {
                path: 'permissions',
                model: 'Permission'
            }
        }).populate({
            path: 'permissions',
            model: 'Permission'
        }).exec((err, user) => {
            if (err) {
                return res.redirect('/auth/login');
            }
            if (!user) {
              req.flash('errors', 'Authentication failed. User not found.');
              return res.redirect('/auth/login');
            } else {
              // check if password matches
              user.comparePassword(req.body.password, (err, isMatch) => {
                if (err) {
                    req.flash('errors', 'An error happened');
                    return res.redirect('/auth/login');
                }
                if (isMatch) {
                    let permissions = [];

                    if (user.roles) {
                        for (let i=0; i< user.roles.length; i++) {
                            if (user.roles[i].permissions) {
                                for (let j=0; j<user.roles[i].permissions.length; j++) {
                                    permissions.push(user.roles[i].permissions[j].accessRouter);
                                }
                            }
                        }
                    }

                    if (user.permissions) {
                        for (let k=0; k<user.permissions.length; k++) {
                            permissions.push(user.permissions[k].accessRouter);
                        }
                    }

                    req.session.user = user;
                    req.session.permissions = permissions;
                    if (req.body.remember) {
                        req.session.remember = true;
                        req.session.cookie.maxAge = parseInt(process.env.SESSION_EXP);
                    }

                    if (global.io) {
                        global.io.sockets.emit('member_login', user.fullName + ' đã đăng nhập');
                    }

                    res.redirect(req.session.redirectTo || '/');
                } else {
                    return res.redirect('/user/login');
                }
              })
            }
        })
    } catch (e) {
       next(e);
    }
};

exports.getLogout = (req, res, next) => {
    LoginManager.findOne({sessionId: req.sessionID}).exec((err, deviceLogin) => {
        if (deviceLogin) {
            deviceLogin.remove();
        }
    });
    req.session.cookie.maxAge = 0;
    req.session.destroy();
    res.redirect('/auth/login');
}