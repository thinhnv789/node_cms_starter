var apiRouters = function(app) {
    const apiAuthRouter = require('./auth');
    const apiUserRouter = require('./user');
    const apiMediaRouter = require('./media');
    const apiChatRouter = require('./chat');

    app.use('/api/auth', apiAuthRouter);
    app.use('/api/user', apiUserRouter);
    app.use('/api/media', apiMediaRouter);
    app.use('/api/chat', apiChatRouter);
}

module.exports = apiRouters;

