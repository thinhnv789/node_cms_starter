const passport = require('passport');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const publicUrl = '/auth/login';
/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        req.session.touch();

        if (req.session.remember) {
            req.session.cookie.maxAge = parseInt(process.env.SESSION_EXP);
        }

        return next();
    }

    let accessRouter = req.originalUrl;
  
    req.session.redirectTo = accessRouter;
    return res.redirect(publicUrl);
};