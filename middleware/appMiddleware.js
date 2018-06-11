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

/**
 * Check permission route
 */
exports.isAllowed = (req, res, next) => {
    let isAllowed = false, permissions = req.session.permissions || [], originalUrl = req.originalUrl;

    for (let i=0; i<permissions.length; i++) {
        if (originalUrl.indexOf(permissions[i]) > -1) {
            isAllowed = true;
            break;
        }
    }

    if (isAllowed) {
        next();
    } else {
        res.render('permission-denied');
    }
}