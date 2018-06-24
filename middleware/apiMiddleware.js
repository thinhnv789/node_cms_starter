const Auth = require('../helpers/auth');

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
    let token = '';
    if (req.session.user) {
        // req.session.user.touch();
        return next();
    } else {
        let token = req.query.token || req.headers['x-access-token'] || req.headers['Authorization'] || req.headers['authorization'];
        
        /**
         * Remove bearer or basic
         */
        if (token){
            token = token.split(' ');
            token = token[token.length - 1];
        }

        Auth.jwtVerifyToken(token, (user) => {
            if (user) {
                req.session.user = user;
                return next();
            } else {
                return res.json({
                    success: false,
                    errorCode: '403',
                    message: req.i18n.__('REQUIRED_LOGIN')
                });
            }
        });
    }
};