const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // for testing; tighten later
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// 🌐 Socket.IO logic
io.on('connection', (socket) => {
  console.log('⚡ A user connected:', socket.id);

  socket.on('join', ({ room }) => {
    socket.join(room);
    console.log(`🚪 User joined room: ${room}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('💨 A user disconnected:', socket.id);
  });
});
