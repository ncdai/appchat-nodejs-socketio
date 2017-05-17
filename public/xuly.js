var socket = io('http://localhost:3000');

socket.on('server-send-dki-thatbai', function() {
    alert('Sai username, co nguoi da dang ki roi');
});

socket.on('server-send-danhsach-users', function(data) {
    $('#boxContent').html("");
    data.forEach(function(i) {
        $('#boxContent').append("<div class='userOnline'>" + i + "</div>");
    });
});

socket.on('server-send-dki-thanhcong', function(data) {
    $('#currentUser').html(data);
    $('#loginForm').hide(2000);
    $('#chatForm').show(1000);
});

socket.on('server-send-message', function(data) {
    $('#listMessages').append('<div class="ms">' + data.username + ': ' + data.noidung  + '</div>');
});

socket.on('ai-do-dang-go-chu', function(data) {
    $('#thongbao').html(data);
});

socket.on('ai-do-ngung-go-chu', function(data) {
    $('#thongbao').html("");
});

$(document).ready(function() {
    $('#loginForm').show();
    $('#chatForm').hide();

    $('#btn-register').click(function() {
        socket.emit('client-send-username', $('#txtUsername').val());
    });

    $('#btnLogout').click(function() {
        socket.emit('logout');
    });

    $('#btnSendMessage').click(function() {
        socket.emit('client-send-message', $('#txtMessage').val());
    });

    $('#txtMessage').focusin(function() {
        socket.emit('toi-dang-go-chu');
    });

    $('#txtMessage').focusout(function() {
        socket.emit('toi-ngung-go-chu');
    });

});