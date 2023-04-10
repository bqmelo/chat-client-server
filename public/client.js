(function() {
    const app = document.querySelector('.app');
    const socket = io();

    let uname;

    app.querySelector('.join-screen #join-user').addEventListener('click', function() {
        let username = app.querySelector('.join-screen #username').value;

        if(username.length == 0) {
            return alert("O campo 'Seu nome' é obrigatório!");;
        }

        socket.emit('newUser', username);
        uname = username;
        app.querySelector('.join-screen').classList.remove('active');
        app.querySelector('.chat-screen').classList.add('active');
    });

    app.querySelector('.join-screen #username').addEventListener('keypress', function(event) {
        if(event.keyCode == 13) {
            event.preventDefault();
            document.getElementById('join-user').click();
        }
    });

    app.querySelector('.chat-screen #send-message').addEventListener('click', function() {
        let message = app.querySelector('.chat-screen #message-input').value;
        if(message.length == 0 ) {
            return;
        }

        renderMessage('my', {
            username: uname,
            text: message
        });

        socket.emit('chat', {
            username: uname,
            text: message
        });

        app.querySelector('.chat-screen #message-input').value = '';
    });

    app.querySelector('.chat-screen #message-input').addEventListener('keypress', function(event) {
        if(event.keyCode == 13) {
            event.preventDefault();
            document.getElementById('send-message').click();
        }
    });

    app.querySelector('.chat-screen #exit-chat').addEventListener('click', function() {
        socket.emit('exitUser', uname);
        window.location.href = window.location.href;
    });

    socket.on('update', function(update) {
        renderMessage('update', update);
    });

    socket.on('chat', function(message) {
        renderMessage('other', message);
    });

    function renderMessage(type, message) {
        const date = new Date();
        let hours;
        let minutes;

        if(date.getHours() < 10) {
            hours = String(date.getHours()).padStart(2, '0')
        } else {
            hours = date.getHours();
        }

        if(date.getMinutes() < 10) {
            minutes = String(date.getMinutes()).padStart(2, '0')
        } else {
            minutes = date.getMinutes();
        }

        let messageContainer = app.querySelector('.chat-screen .messages');
        if(type == 'my') {
            let el = document.createElement('div');
            el.setAttribute('class', 'message my-message');
            el.innerHTML = `
                <div>
                    <div class="name">Você</div>
                    <div class="text"> ${message.text} </div>
                    <span class="time">${hours}:${minutes}</span>
                </div>
            `;
            messageContainer.appendChild(el);

        } else if (type == 'other') {
            let el = document.createElement('div');
            el.setAttribute('class', 'message other-message');
            el.innerHTML = `
                <div>
                    <div class="name"> ${message.username} </div>
                    <div class="text"> ${message.text} </div>
                    <span class="time">${hours}:${minutes}</span>
                </div>
            `
            messageContainer.appendChild(el);

        } else if (type == 'update') {
            let el = document.createElement('div');
            el.setAttribute('class', 'update');
            el.innerText = message;
            messageContainer.appendChild(el);
        }

        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();