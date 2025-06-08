const Message = require('../models/Message');

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ listingId: req.params.listingId });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    // Always use listingId from params, not from body
    const { text, receiverId } = req.body;
    const senderId = req.user.id;
    const listingId = req.params.listingId;
    if (!text || !receiverId || !listingId) {
      console.error('Missing required fields:', { text, receiverId, listingId });
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const message = await Message.create({ text, receiverId, listingId, senderId });
    console.log('Message created:', message);
    res.status(201).json(message);
  } catch (err) {
    console.error('Error in sendMessage:', err);
    next(err);
  }
};
