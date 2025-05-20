const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getMessages, sendMessage, getChats } = require('../controllers/chatController');

// Get chat history with a user
router.get('/:userId', verifyToken, getMessages);

// Send a chat message (POST)
router.post('/send', verifyToken, sendMessage);
router.get('/', verifyToken, getChats);      

module.exports = router;
