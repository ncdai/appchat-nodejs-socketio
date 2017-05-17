var express = require('express');
var app = express();
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

var mangUsers = ["AAA"];

io.on('connection', function(socket) {
    console.log('Co nguoi ket noi ' + socket.id);
    
    socket.on('client-send-username', function(data) {
        if (mangUsers.indexOf(data) >= 0) {
            // fail
            socket.emit('server-send-dki-thatbai');
        } else {
            // dang ky thanh cong
            mangUsers.push(data);
            socket.username = data;
            socket.emit('server-send-dki-thanhcong', data);
            io.sockets.emit('server-send-danhsach-users', mangUsers);
        }
    });

    socket.on('client-send-message', function(data) {
        io.sockets.emit('server-send-message', { username: socket.username, noidung: data });
    });

    socket.on('logout', function() {
        mangUsers.splice(mangUsers.indexOf());
        socket.broadcast.emit('server-send-danhsach-users', mangUsers);
    });

    socket.on('toi-dang-go-chu', function() {
        var s = socket.username + ' dang go chu';
        io.sockets.emit('ai-do-dang-go-chu', s);
    });

    socket.on('toi-ngung-go-chu', function() {
        var s = socket.username + ' ngung dang go chu';
        io.sockets.emit('ai-do-ngung-go-chu', s);
    });

});

app.get('/', function(req, res) {
    res.render('trangchu');
});
