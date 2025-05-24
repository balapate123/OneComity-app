const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getMessages, sendMessage, getChats, hideChatForUser, deleteChatWithUser } = require('../controllers/chatController');

// Get chat history with a user
router.get('/:userId', verifyToken, getMessages);

// Send a chat message
router.post('/send', verifyToken, sendMessage);

// Get all chats
router.get('/', verifyToken, getChats);

// Hide (delete for me) a chat with a user
router.delete('/:partnerId/hard', verifyToken, deleteChatWithUser);

module.exports = router;
