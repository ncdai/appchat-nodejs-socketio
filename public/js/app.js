var socket = io('http://192.168.1.100:3000');

socket.on('server-send-register-error', function(data) {
    console.log(data);
    $('.form-group').addClass('has-error');
    $('#registerResult').html(data.res).css('display', 'block');
});

socket.on('server-send-register-success', function(data) {
    $('.form-group').removeClass('has-error').addClass('has-success');
    $('#registerResult').html(data.res).css('display', 'block');
    $('#userInfo').html(data.username);
    $('#login').hide();
    $('#user').show();
    $('#chat').show();
});

socket.on('server-send-list-users', function(data) {
    $('#listUsers').html('');
    data.forEach(function(e) {
        $('#listUsers').append('<a href="#" class="list-group-item">' + e +  '</a>');
    });
});

socket.on('server-send-message', function(data) {
    if (data.id == socket.id) myMessage = 'right'; else myMessage = '';
    $('#listMessages').append('<div class="message ' + myMessage + '"><h4 class="message-username">' + data.username + '</h4><div class="message-content"><span>' + data.message + '</span></div></div>');
    $('#listMessages').scrollTop($('#listMessages').prop('scrollHeight'));
});

socket.on('server-send-list-typing', function(data) {
    console.log('hello');
    $('#typing').html('');
    console.log(socket.username);
    data.forEach(function(e) {
        if (e !== socket.username) {
            $('#typing').append('<div><img src="img/typing.gif" height="40px" />' + e + ' is typing message</div>');
        }
    });
});

$(document).ready(function() {

    // $('#chat').show();
    // $('#login').hide();

    $('#username').keyup(function(e) {
        if (e.which == 13) {
            console.log('LOGIN!!!');
            var username = $(this).val();
            socket.emit('client-send-username', username);
            socket.username = username;
            $(this).val('');
        }
    });
    $('#logout').click(function() {
        console.log('LOGOUT!!!');
        socket.emit('client-send-logout');
        $('#login').show();
        $('#chat').hide();
    });
    $('#textMessage').keyup(function(e) {
        if (e.which == 13) {
            var message = $(this).val();
            socket.emit('client-send-message', message);
            $(this).val('');
        }
    });
    $('#textMessage').focusin(function() {
        socket.emit('client-send-typing');
    });
    $('#textMessage').focusout(function() {
        socket.emit('client-send-stop-typing');
    });
});

// socket.on('server-send-dki-thatbai', function() {
//     alert('Sai username, co nguoi da dang ki roi');
// });

// socket.on('server-send-danhsach-users', function(data) {
//     $('#boxContent').html("");
//     data.forEach(function(i) {
//         $('#boxContent').append("<div class='userOnline'>" + i + "</div>");
//     });
// });

// socket.on('server-send-dki-thanhcong', function(data) {
//     $('#currentUser').html(data);
//     $('#loginForm').hide();
//     $('#chatForm').show();
// });

// socket.on('server-send-message', function(data) {
//     $('#listMessages').append('<div class="ms ' + data.id + '">' + data.username + ': ' + data.noidung  + '</div>');
//     $('#listMessages').scrollTop($('#listMessages').prop('scrollHeight'));
// });

// socket.on('my-message', function() {
//     $('.' + socket.id).addClass('right');
// });

// socket.on('ai-do-dang-go-chu', function(data) {
//     $('#thongbao').html(data + '...');
// });

// socket.on('ai-do-ngung-go-chu', function(data) {
//     $('#thongbao').html('');
// });

// $(document).ready(function() {
//     $('#loginForm').show();
//     $('#chatForm').hide();

//     $('#btn-register').click(function() {
//         socket.emit('client-send-username', $('#txtUsername').val());
//     });

//     $('#btnLogout').click(function() {
//         socket.emit('logout');
//         $('#loginForm').show();
//         $('#chatForm').hide();
//     });

//     $('#txtMessage').keyup(function(e) {
//         if (e.which == 13) {
//             socket.emit('client-send-message', $('#txtMessage').val());
//             $('#txtMessage').val('').focus();
//         }
//     });

//     $('#txtMessage').focusin(function() {
//         socket.emit('toi-dang-go-chu');
//     });

//     $('#txtMessage').focusout(function() {
//         socket.emit('toi-ngung-go-chu');
//     });

// });