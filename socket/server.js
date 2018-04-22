const platform = require('platform');
const LoginManager = require('./../models/LoginManager');

var ioEvents = function(io) {
    io.on('connection', (socket) => {
        // console.log('io.session', io.session);
        if (io.session && io.session.user) {
            socket.user = io.session.user;
            socket.join(socket.user._id);
            /* Ignore duplicate connection when restart server */
            // io.removeAllListeners();

            /**
             * Update login manager collections
             */
            const p = platform.parse(socket.request.headers['user-agent']);
          
            if (p) {
                let newLogin = new LoginManager();
                newLogin.user = socket.user._id;
                newLogin.userName = socket.user.userName,
                newLogin.fullName = socket.user.fullName,
                newLogin.sessionId = io.sessionID;
                newLogin.os = p.os;
                newLogin.platform = p.name;
                newLogin.save();
            }

            /**
             * Event socket disconnected
             */
            socket.on('disconnect', () => {
                /* Remove device login */
                LoginManager.findOne({sessionId: io.sessionID}).exec((err, deviceLogin) => {
                    if (deviceLogin) {
                        deviceLogin.remove();
                    }
                });
            })
        } else {
            // console.log('server disconnect');
            // socket.emit('authenticate_failed');
            // socket.disconnect(true);
        }
        // socket.emit('hello', 'hello world');
    })
}

module.exports = ioEvents;