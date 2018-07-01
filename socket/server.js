const io = require('socket.io')();
// const platform = require('platform');
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);

const Auth = require('./../helpers/auth');
const LoginManager = require('./../models/LoginManager');
const Message = require('./../models/Message');
const RecentMessage = require('./../models/RecentMessage');

var sessionMiddleware = session({
    resave: true,
    rolling : true,
    saveUninitialized: false,
    secret: process.env.SECRET, // realtime chat system
    cookie:{ maxAge: parseInt(process.env.SESSION_EXP) },
    store: new MongoStore({
      url: process.env.MONGO_DB,
      autoReconnect: true,
    })
});
io.use(function(socket, next) {
    sessionMiddleware(socket.request, {}, next);
});

var ioAuthenticatedEvents = function(socket) {
    /* User join to personal room */
    console.log('socket userId', socket.user._id);
    socket.join(socket.user._id);
    /* Ignore duplicate connection when restart server */
    // io.removeAllListeners();

    /**
     * Update login manager collections
     */
    // const p = platform.parse(socket.request.headers['user-agent']);
    
    // if (p) {
    //     let newLogin = new LoginManager();
    //     newLogin.user = socket.user._id;
    //     newLogin.userName = socket.user.userName,
    //     newLogin.fullName = socket.user.fullName,
    //     newLogin.sessionId = io.sessionID;
    //     newLogin.os = p.os;
    //     newLogin.platform = p.name;
    //     newLogin.save();
    // }

    /**
     * Event send message
     */
    socket.on('send_message', (data) => {
        // console.log('data send', data);
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
            data.isOwner = true;
            io.to(socket.user._id).emit('message', data);

            /**
             * Save message to database
             */
            let newMessageData = {
                sender: data.sender._id,
                recipient: data.recipient._id,
                messageContent: data.messageContent
            }
            let newMessage = new Message(newMessageData);
            newMessage.save((err, m) => {
                // Create or update recent message
                if (m) {
                    RecentMessage.findOne({
                        sender: data.sender._id,
                        recipient: data.recipient._id
                    }).exec((err, recentMessage) => {
                        if (recentMessage) {
                            recentMessage.latestMessage = m._id;
                            recentMessage.latestMessageContent = m.messageContent;
                            recentMessage.countUnread = recentMessage.countUnread + 1;
                            recentMessage.save();
                        } else {
                            let newRecord = new RecentMessage();
                            newRecord.sender = data.sender._id;
                            newRecord.recipient = data.recipient._id;
                            newRecord.latestMessage = m._id;
                            newRecord.latestMessageContent = m.messageContent;
                            newRecord.countUnread = 1;
                            newRecord.save();
                        }
                    })
                }
            });
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

io.on('connection', (socket) => {
    let user = {};
    if (socket.request.session && socket.request.session.user) {
        user = socket.request.session.user;
        if (user && user._id) {
            socket.user = user;
            ioAuthenticatedEvents(socket);
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
});

module.exports = io;