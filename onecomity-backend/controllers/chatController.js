const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const myId = req.user.id;

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
