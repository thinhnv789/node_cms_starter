/*
* Connect socket
*/
const socket = io('http://localhost:8008');

socket.on('connect', () => {
    socket.on('hello', (data) => {
        console.log(data);
    });
});