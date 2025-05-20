const Message = require('../models/Message');
const User = require('../models/User');

exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const myId = req.user.id;
  console.log('In Get Messages');

  try {
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId }
      ]
    }).sort('timestamp');
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load messages');
  }
};

// For backup/manual send (not needed if you use only Socket.IO)
exports.sendMessage = async (req, res) => {
  const myId = req.user.id;
  const { receiverId, text } = req.body;
  console.log('In Send Messages');

  if (!text || !receiverId) {
    return res.status(400).json({ msg: 'Message text and receiverId are required.' });
  }

  try {
    const message = new Message({
      sender: myId,
      receiver: receiverId,
      text
    });
    await message.save();
    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to send message');
  }
};

exports.getChats = async (req, res) => {
  const myId = req.user.id;
  try {
    // Find distinct userIds you've chatted with
    const sent = await Message.find({ sender: myId }).distinct('receiver');
    const received = await Message.find({ receiver: myId }).distinct('sender');
    const chatUserIds = Array.from(new Set([...sent, ...received])).filter(id => id !== myId);

    // Fetch usernames and names for these userIds
    const users = await User.find({ _id: { $in: chatUserIds } }, '_id username name');

    // For preview, you can also add last message etc.
    res.json({ chats: users });
  } catch (err) {
    console.error('Get chats error:', err);
    res.status(500).send('Failed to load chats');
  }
};