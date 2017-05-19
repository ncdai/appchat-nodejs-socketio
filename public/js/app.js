var socket = io('http://192.168.1.4:5000');

socket.on('server-send-register-error', function(data) {
    console.log(data);
    $('.form-group').addClass('has-error');
    $('#registerResult').html(data.res).css('display', 'block');
});

socket.on('server-send-register-success', function(data) {
    console.log('dang ki thanh cong');
    $('.form-group').removeClass('has-error');
    $('#userInfo').html(data.username);
    $('#login').hide();
    $('#user').show();
    $('#chat').show();
});

// hien thi danh sach user dang online
socket.on('server-send-list-users', function(data) {
    $('#listUsers').html('');
    data.forEach(function(e) {
        $('#listUsers').append('<a href="#" class="list-group-item">' + e +  '</a>');
    });
});

socket.on('server-send-list-messages', function(data) {
    data.forEach(function(e) {
        // console.log(e);
        sendMessages(e);
    });
});

function sendMessages(data) {
    var lastUsername = $( "#listMessages > div.message-group:last" ).attr("username");
    sameLastMessage = false;
    if (lastUsername === data.username) {
        // neu tin nhan truoc la cua toi -> hien thi tin nhan moi trong .message-group
        const html = `
            <div class="including">
                <div class="message">` + data.message + `</div>
            </div>`;

        $("#listMessages > div.message-group:last").find('.message:last').addClass('bottom');
        $("#listMessages > div.message-group:last").find('#messages').append(html);

        sameLastMessage = true;
    } else {
        // tin nhan moi
        if (data.username == socket.username) {
            // tin nhan cua toi
            const html = `
                <div class="message-group me" username="` + data.username + `">
                    <div class="message-body">
                        <div id="messages">
                            <div class="including">
                                <div class="message">` + data.message + `</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('#listMessages').append(html);
        } else {
            // tin nhan moi
            const html = 
            `<div class="message-group" username="` + data.username + `">
                <img src="img/no-avatar.png" class="message-avatar" />
                <div class="message-body">
                    <h4 class="message-username">` + data.username + `</h4>
                    <div id="messages">
                        <div class="including">
                            <div class="message">` + data.message + `</div>
                        </div>
                    </div>
                </div>
            </div>`;
            $('#listMessages').append(html);
        }
    }
    
    if (sameLastMessage) {
        $( "#listMessages > div.message-group:last" ).find('.message:last').removeClass('bottom');
        $( "#listMessages > div.message-group:last" ).find('.message:last').addClass('top');
    }
    
    $('#listMessages').scrollTop($('#listMessages').prop('scrollHeight'));
};

// hien thi tin nhan moi tu user
socket.on('server-send-message', function(data) {
    sendMessages(data);
    // var lastUsername = $( "#listMessages > div.message-group:last" ).attr("username");
    // sameLastMessage = false;
    // if (lastUsername === data.username) {
    //     // neu tin nhan truoc la cua toi -> hien thi tin nhan moi trong .message-group
    //     const html = `
    //         <div class="including">
    //             <div class="message">` + data.message + `</div>
    //         </div>`;

    //     $("#listMessages > div.message-group:last").find('.message:last').addClass('bottom');
    //     $("#listMessages > div.message-group:last").find('#messages').append(html);

    //     sameLastMessage = true;
    // } else {
    //     // tin nhan moi
    //     if (data.id == socket.id) {
    //         // tin nhan cua toi
    //         const html = `
    //             <div class="message-group me" username="` + data.username + `">
    //                 <div class="message-body">
    //                     <div id="messages">
    //                         <div class="including">
    //                             <div class="message">` + data.message + `</div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         `;
    //         $('#listMessages').append(html);
    //     } else {
    //         // tin nhan moi
    //         const html = 
    //         `<div class="message-group" username="` + data.username + `">
    //             <img src="img/no-avatar.png" class="message-avatar" />
    //             <div class="message-body">
    //                 <h4 class="message-username">` + data.username + `</h4>
    //                 <div id="messages">
    //                     <div class="including">
    //                         <div class="message">` + data.message + `</div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>`;
    //         $('#listMessages').append(html);
    //     }
    // }
    
    // if (sameLastMessage) {
    //     $( "#listMessages > div.message-group:last" ).find('.message:last').removeClass('bottom');
    //     $( "#listMessages > div.message-group:last" ).find('.message:last').addClass('top');
    // }
    
    // $('#listMessages').scrollTop($('#listMessages').prop('scrollHeight'));
});

// hien thi user dang nhap tin nhan
socket.on('server-send-list-typing', function(data) {
    data.forEach(function(e) {
        if (e !== socket.username) {
            const html =
            `<div class="typing ` + e + `">
                <img src="img/no-avatar.png" class="message-avatar" />
                <div class="message-body">
                    <h4 class="message-username">` + e + `</h4>
                    <img src="img/typing.gif" class="typing-image" />
                </div>
            </div>`;
            $('#listMessages').append(html);
        }
        $('#listMessages').scrollTop($('#listMessages').prop('scrollHeight'));
    });
});

// hien thi danh sach user dang nhap tin nhan
socket.on('server-send-typing', function(e) {
    if (e !== socket.username) {
        const html =
            `<div class="typing ` + e + `">
                <img src="img/no-avatar.png" class="message-avatar" />
                <div class="message-body">
                    <h4 class="message-username">` + e + `</h4>
                    <img src="img/typing.gif" class="typing-image" />
                </div>
            </div>`;
        $('#listMessages').append(html);
    }
    $('#listMessages').scrollTop($('#listMessages').prop('scrollHeight'));
});

// xoa hien thi user dang nhap tin nhan
socket.on('server-send-stop-typing', function(data) {
    $('#listMessages').find('.typing.' + data).remove();
});

$(document).ready(function() {

    // $('#chat').show();
    // $('#login').hide();

    $('#username').keyup(function(e) {
        if (e.which == 13) {
            var username = $(this).val();
            socket.emit('client-send-username', username);
            socket.username = username;
            $(this).val('');
        }
    });
    $('#logout').click(function() {
        socket.emit('client-send-logout');
        $('#user').hide();
        $('#login').show();
        $('#chat').hide();
        $('#listMessages').html('');
    });
    $('#textMessage').keyup(function(e) {
        if (e.which == 13) {
            var message = $(this).val();
            if (message) {
                socket.emit('client-send-message', message);
                $(this).val('');
                socket.emit('client-send-stop-typing');
                socket.emit('client-send-typing');
            }
        }
    });
    // toi dang nhap tin nhan
    $('#textMessage').focusin(function() {
        socket.emit('client-send-typing');
    });
    // toi ngung nhap tin nhan
    $('#textMessage').focusout(function() {
        socket.emit('client-send-stop-typing');
    });
});