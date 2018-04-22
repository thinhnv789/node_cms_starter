
var ioEvents = function(io) {
    io.on('connection', (socket) => {
        /* Ignore duplicate connection when restart server */
        io.removeAllListeners();
        
        if (socket.handshake.session.user) {
            socket.user = socket.handshake.session.user;
            socket.join(socket.user._id);
        } else {
            socket.emit('authenticate_failed');
            socket.disconnect(true);
        }
        // socket.emit('hello', 'hello world');
    })
}

module.exports = ioEvents;