const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname+'/public')));

io.on('connection', function(socket) {
    console.log(`\n\nCliente conectado.\nSocket id: ${socket.id}`);

    socket.on('newUser', function(username) {
        socket.broadcast.emit('update', username + ' entrou na sala');
        console.log(`\n\nCliente entrou na Sala.\nSocket id: ${socket.id}, Nome: ${username}`);
    });

    socket.on('exitUser', function(username) {
        socket.broadcast.emit('update', username + ' saiu da sala');
        console.log(`\n\nCliente desconectado.\n Socket id: ${socket.id}`);
    });

    socket.on('chat', function(message) {
        socket.broadcast.emit('chat', message);
        console.log(`\n\nMensagem recebida do socket: ${socket.id}`)
    });
});

server.listen(5000, () => {
    console.log('Servidor rodando');
});