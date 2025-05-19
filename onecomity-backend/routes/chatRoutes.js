const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getMessages } = require('../controllers/chatController');

router.get('/:userId', verifyToken, getMessages);

module.exports = router;
