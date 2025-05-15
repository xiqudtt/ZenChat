require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const connectDB = require('./config/db');
const { protectSocket } = require('./middleware/authMiddleware');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);


connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (err) {
        return next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on('join_room', async (roomId) => {
        socket.join(roomId);
        console.log(`🚪 User ${socket.id} joined room ${roomId}`);
        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
        socket.emit('load_messages', messages);
    });

    socket.on('send_message', async (data) => {
        const { roomId, text } = data;
        const user = await User.findById(socket.userId);

        const message = await Message.create({
            roomId,
            sender: user.username,
            text
        });

        io.to(roomId).emit('receive_message', message);
        console.log(`✉️ Message in ${roomId}:`, message);
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🖥️ Server running on port ${PORT}`);
});