const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
const UserModel = require('./../models/User');
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
    const user = req.session.user;
    let isAllowed = true, permissions = [], originalUrl = req.originalUrl.split('?')[0];

    if (user) {
        let permissionKey = 'permissions_' + user._id;
        client.get(permissionKey, (err, pers) => {
            if (pers) {
                for (let i=0; i<pers.length; i++) {
                    if (originalUrl == pers[i].accessRouter) {
                        isAllowed = true;
                    }
                }
                res.locals.userPermissions = JSON.parse(pers);
                console.log('From cached');
                if (isAllowed) {
                    next();
                } else {
                    res.render('permission-denied');
                }
            } else {
                UserModel.findById(req.session.user._id).populate({
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
                    if (user.roles) {
                        for (let i=0; i< user.roles.length; i++) {
                            if (user.roles[i].permissions) {
                                for (let j=0; j<user.roles[i].permissions.length; j++) {
                                    permissions.push(user.roles[i].permissions[j].accessRouter);
                                    if (originalUrl == user.roles[i].permissions[j].accessRouter) {
                                        console.log('role', user.roles[i].permissions[j].accessRouter);
                                        isAllowed = true;
                                    }
                                }
                            }
                        }
                    }
                
                    if (user.permissions) {
                        for (let k=0; k<user.permissions.length; k++) {
                            permissions.push(user.permissions[k].accessRouter);
                            if (originalUrl == user.permissions[k].accessRouter) {
                                console.log('per', user.permissions[k].accessRouter);
                                isAllowed = true;
                            }
                        }
                    }
                
                    res.locals.userPermissions = permissions;
                    console.log('permissionssss', permissions);
                    client.set(permissionKey, JSON.stringify(permissions));
                    if (isAllowed) {
                        next();
                    } else {
                        res.render('permission-denied');
                    }
                });
            }
        })
    } else {
        UserModel.findById(req.session.user._id).populate({
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
            let permissionKey = 'permissions_' + user._id;
            if (user.roles) {
                for (let i=0; i< user.roles.length; i++) {
                    if (user.roles[i].permissions) {
                        for (let j=0; j<user.roles[i].permissions.length; j++) {
                            permissions.push(user.roles[i].permissions[j].accessRouter);
                            if (originalUrl == user.roles[i].permissions[j].accessRouter) {
                                console.log('role', user.roles[i].permissions[j].accessRouter);
                                isAllowed = true;
                            }
                        }
                    }
                }
            }
        
            if (user.permissions) {
                for (let k=0; k<user.permissions.length; k++) {
                    permissions.push(user.permissions[k].accessRouter);
                    if (originalUrl == user.permissions[k].accessRouter) {
                        console.log('per', user.permissions[k].accessRouter);
                        isAllowed = true;
                    }
                }
            }
        
            res.locals.userPermissions = permissions;
            client.set(permissionKey, JSON.stringify(permissions));
            if (isAllowed) {
                next();
            } else {
                res.render('permission-denied');
            }
        });
    }
}