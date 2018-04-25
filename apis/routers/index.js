var apiRouters = function(app) {
    const apiMediaRouter = require('./media');

    app.use('/api/media', apiMediaRouter);
}

module.exports = apiRouters;

