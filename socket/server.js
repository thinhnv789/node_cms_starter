
var ioEvents = function(io) {
    io.on('connection', (socket) => {
        io.removeAllListeners();
        console.log('socket connected');
        socket.join('helpdesk');
        // socket.emit('hello', 'hello world');
    })
}

module.exports = ioEvents;