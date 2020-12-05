var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/uppgift3.html');
});

io.on('connection', (socket) => {
    socket.username = "";
//    console.log('a user connected');
    socket.on('disconnect', () => {
        io.emit('disconnected', { user: socket.username });
        console.log(socket.username + " disconnected");
    });
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });
    socket.on('emote', (msg) => {
        socket.broadcast.emit('emote', msg);
    });
    socket.on("nick", (msg) => {
//        console.log(socket.username + " => " + msg.user);
        socket.broadcast.emit("nick", { user: socket.username, newuser: msg.user });
        socket.username = msg.user;
    });
    socket.on('connected', (msg) => {
//        console.log(msg.user);
        socket.username = msg.user;
        socket.broadcast.emit('connected', msg);
    });
});
http.listen(3000, () => {
    console.log('listening on *:3000');
});