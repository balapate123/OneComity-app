const express = require('express');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');



app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));




module.exports = app;
