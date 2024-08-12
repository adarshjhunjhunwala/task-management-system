const express = require('express');
const next = require('next');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
require('dotenv').config()
const { getTasksDueSoon } = require('./app/lib/taskUtils');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = socketIo(httpServer);

    let connectedClients = {};

    io.on('connection', (socket) => {
        console.log('New client connected');
        
        socket.on('register', (userId) => {
            connectedClients[userId] = socket.id;
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');

            for (const [userId, socketId] of Object.entries(connectedClients)) {
                if (socketId === socket.id) {
                    delete connectedClients[userId];
                    break;
                }
            }
        });
    });

    cron.schedule('* * * * *', async () => {
        const tasksDueSoon = await getTasksDueSoon();

        tasksDueSoon.forEach(task => {
            const userId = task.userId;
            task.link = "/tasks";
            if (connectedClients[userId]) {
                io.to(connectedClients[userId]).emit('reminder', task);
            }
        });
    });

    server.all('*', async (req, res) => {
        return handle(req, res);
    });

    httpServer.listen(3000, (err) => {
        if (err) throw err;
        console.log(`Ready on ${process.env.NEXTAUTH_URL}`);
    });
});