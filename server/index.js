import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

import { analyzePitch } from './controllers/aiController.js';
import { getUserProfile, updateProfile, createUser } from './controllers/userController.js';
import { scanReceipt } from './controllers/ocrController.js';

// Routes
app.get('/', (req, res) => {
    res.send('EmpowerHer API is running...');
});

app.post('/api/pitch/analyze', analyzePitch);
app.get('/api/users/:firebaseId', getUserProfile);
app.post('/api/users', createUser);
app.put('/api/users/:firebaseId', updateProfile);
app.post('/api/ocr/scan', scanReceipt);

// Socket.io for Community Chat
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on('send_message', (data) => {
        // Broadcast to everyone in the room except sender
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
