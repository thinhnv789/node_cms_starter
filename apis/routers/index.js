var apiRouters = function(app) {
    const apiMediaRouter = require('./media');
    const apiChatRouter = require('./chat');

    app.use('/api/media', apiMediaRouter);
    app.use('/api/chat', apiChatRouter);
}

module.exports = apiRouters;

