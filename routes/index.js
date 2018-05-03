var appRouters = function(app) {
    const dashboardRouter = require('./dashboard');
    const newsCategoryRouter = require('./news-category');
    const newsRouter = require('./news');
    const accountRouter = require('./account');
    const authRouter = require('./auth');
    const loginManagerRouter = require('./login-manager');
    const logRouter = require('./log');

    app.use('/', dashboardRouter);
    app.use('/news-category', newsCategoryRouter);
    app.use('/news', newsRouter);
    app.use('/account', accountRouter);
    app.use('/auth', authRouter);
    app.use('/login-manager', loginManagerRouter);
    app.use('/log', logRouter);
}

module.exports = appRouters;

