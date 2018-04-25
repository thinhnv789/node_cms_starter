var appRouters = function(app) {
    const dashboardRouter = require('./dashboard');
    const accountRouter = require('./account');
    const authRouter = require('./auth');
    const loginManagerRouter = require('./login-manager');
    const logRouter = require('./log');

    app.use('/', dashboardRouter);
    app.use('/account', accountRouter);
    app.use('/auth', authRouter);
    app.use('/login-manager', loginManagerRouter);
    app.use('/log', logRouter);
}

module.exports = appRouters;

