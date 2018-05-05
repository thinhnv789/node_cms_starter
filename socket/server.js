const platform = require('platform');
const Auth = require('./../helpers/auth');
const LoginManager = require('./../models/LoginManager');
const Message = require('./../models/Message');

var ioAuthenticatedEvents = function(io, socket) {
    /* User join to personal room */
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
     * Event send message
     */
    socket.on('send_message', (data) => {
        try {
            data.sender = socket.user;

            try {
                io.to(data.recipient._id).emit('message', data);
            } catch (e) {
                console.log('err send message');
            }

            /**
             * Event send message to sender
             */
            io.to(socket.user._id).emit('owner_message', data);

            /**
             * Save message to database
             */
            let newMessageData = {
                sender: data.sender._id,
                recipient: data.recipient._id,
                messageContent: data.messageContent
            }
            let newMessage = new Message(newMessageData);
            newMessage.save();
        } catch (e) {

        }
    })

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
}

var ioEvents = function(io) {
    io.on('connection', (socket) => {
        let user = {};
        if (socket.request.session && socket.request.session.user) {
            user = socket.request.session.user;
            console.log('user', user);
            if (user && user._id) {
                socket.user = user;
                ioAuthenticatedEvents(io, socket);
            } else {
                console.log('server disconnect');
                socket.emit('authenticate_failed');
                // socket.disconnect(true);
            }
        } else {
            let token = socket.handshake.query.token || socket.handshake.headers['x-access-token'] || socket.handshake.headers['Authorization'] || socket.handshake.headers['authorization'];
        
            /**
             * Remove bearer or basic
             */
            if (token){
                token = token.split(' ');
                token = token[token.length - 1];
            }
            Auth.jwtVerifyToken(token, user => {
                if (user && user._id) {
                    socket.user = user;
                    ioAuthenticatedEvents(io, socket);
                } else {
                    console.log('server disconnect');
                    socket.emit('authenticate_failed');
                    // socket.disconnect(true);
                }
            });
        }
    })
}

module.exports = ioEvents;