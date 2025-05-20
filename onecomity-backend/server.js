const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // tighten for prod
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// 🌐 Socket.IO logic
io.on('connection', (socket) => {
  console.log('⚡ A user connected:', socket.id);

  // User joins their own room (by userId)
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`🚪 User ${userId} joined their room`);
  });

  // User sends a message
  socket.on('sendMessage', async (data) => {
    // data: { sender, receiver, text }
    try {
      // Save message in MongoDB
      const msg = new Message({
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
        timestamp: new Date(),
      });
      await msg.save();

      // Emit to both sender and receiver
      io.to(data.sender).emit('newMessage', msg);
      io.to(data.receiver).emit('newMessage', msg);
      console.log(`💬 Message sent from ${data.sender} to ${data.receiver}`);
    } catch (err) {
      console.error('❌ Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('💨 A user disconnected:', socket.id);
  });
});
