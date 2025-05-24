const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');

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
    // Find user's hidden chats
    const currentUser = await User.findById(myId).select('hiddenChatPartners').lean();
    const hiddenPartners = currentUser?.hiddenChatPartners || [];

    // All chat partners
    const sentPartners = await Message.find({ sender: myId }).distinct('receiver');
    const receivedPartners = await Message.find({ receiver: myId }).distinct('sender');

    const chatPartnerIds = Array.from(new Set([
      ...sentPartners.map(id => id.toString()),
      ...receivedPartners.map(id => id.toString())
    ]))
    .filter(idStr => idStr !== myId.toString())
    .map(idStr => new mongoose.Types.ObjectId(idStr));

    // Fetch user info
    const potentialChatPartners = await User.find({ 
      _id: { $in: chatPartnerIds }
    }, '_id username name activity');

    // For each partner, fetch last message (sent or received)
    const chatsWithLastMessage = await Promise.all(
      potentialChatPartners.map(async partner => {
        // Exclude if hidden
        if (hiddenPartners.some(hiddenId => hiddenId.equals(partner._id))) return null;

        const lastMsg = await Message.findOne({
          $or: [
            { sender: myId, receiver: partner._id },
            { sender: partner._id, receiver: myId }
          ]
        })
        .sort({ timestamp: -1 })
        .lean();

        return {
          ...partner.toObject(),
          lastMessage: lastMsg ? lastMsg.text : "",
          lastTimestamp: lastMsg ? lastMsg.timestamp : null,
        };
      })
    );

    // Filter out nulls, sort by latest message timestamp descending
    const sortedChats = chatsWithLastMessage
      .filter(Boolean)
      .sort((a, b) => {
        if (!a.lastTimestamp) return 1;
        if (!b.lastTimestamp) return -1;
        return new Date(b.lastTimestamp) - new Date(a.lastTimestamp);
      });

    res.json({ chats: sortedChats });
  } catch (err) {
    console.error('Get chats error:', err);
    res.status(500).json({ message: 'Failed to load chats' });
  }
};


// Hide (soft-delete) a chat
exports.hideChatForUser = async (req, res) => {
  const { partnerId } = req.params;
  const userId = req.user.id;

  if (!partnerId) {
      return res.status(400).json({ message: 'Partner ID is required.' });
  }

  try {
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { hiddenChatPartners: partnerId } },
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json({ message: 'Chat hidden successfully.' });
  } catch (error) {
      console.error('Error hiding chat:', error);
      res.status(500).json({ message: 'Server error while hiding chat.' });
  }
};



exports.deleteChatWithUser = async (req, res) => {
    const { partnerId } = req.params;
    const myId = req.user.id;
    try {
        // Remove all messages in both directions
        await Message.deleteMany({
            $or: [
                { sender: myId, receiver: partnerId },
                { sender: partnerId, receiver: myId }
            ]
        });
        // Remove from hiddenChatPartners if you use soft delete as well
        await User.updateOne({ _id: myId }, { $pull: { hiddenChatPartners: partnerId } });
        res.json({ message: "Chat and all messages deleted." });
    } catch (err) {
        console.error('Delete chat error:', err);
        res.status(500).json({ message: "Failed to delete chat." });
    }
};