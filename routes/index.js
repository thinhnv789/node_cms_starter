var appRouters = function(app) {
    const dashboardRouter = require('./dashboard');
    const permissionRouter = require('./permission');
    const roleRouter = require('./role');
    const newsCategoryRouter = require('./news-category');
    const newsRouter = require('./news');
    const accountRouter = require('./account');
    const authRouter = require('./auth');
    const loginManagerRouter = require('./login-manager');
    const logRouter = require('./log');
    const groupChatRouter = require('./group-chat');

    app.use('/', dashboardRouter);
    app.use('/permission', permissionRouter);
    app.use('/role', roleRouter);
    app.use('/news-category', newsCategoryRouter);
    app.use('/news', newsRouter);
    app.use('/account', accountRouter);
    app.use('/auth', authRouter);
    app.use('/login-manager', loginManagerRouter);
    app.use('/log', logRouter);
    app.use('/group-chat', groupChatRouter);
}

module.exports = appRouters;

