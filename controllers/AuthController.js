const platform = require('platform');

const UserModel = require('./../models/User');
const LoginManager = require('./../models/LoginManager');

const Auth = require('../helpers/auth');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getLogin = (req, res, next) => {
    try {
        res.render('auth/login');
    } catch (e) {
       
    }
};

exports.postLogin = (req, res, next) => {
    try {
        UserModel.findOne({
            userName: req.body.userName
        }, (err, user) => {
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
                    /**
                     * Using json web token gen token for client
                     */
                    var token = Auth.jwtCreateToken({
                        userId: user.id
                    });
                    
                    req.session.user = user;

                    if (req.body.remember) {
                        req.session.remember = true;
                        req.session.cookie.maxAge = parseInt(process.env.SESSION_EXP);
                    }

                    /**
                     * Update login manager collections
                     */
                    const p = platform.parse(req.headers['user-agent']);
                    console.log('p', p);
                    if (p) {
                        console.log('ttt');
                        let newLogin = new LoginManager();
                        newLogin.user = user._id;
                        newLogin.userName = user.userName,
                        newLogin.fullName = user.fullName,
                        newLogin.sessionId = req.sessionID;
                        newLogin.os = p.os;
                        newLogin.platform = p.name;
                        newLogin.save();
                    }

                    res.redirect(req.session.redirectTo || '/');
                } else {
                    return res.redirect('/user/login');
                }
              })
            }
        })
    } catch (e) {
       
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