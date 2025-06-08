const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res, next) => {
  try {
    // Get all messages where the user is sender or receiver
    const userId = req.user.id;
    const messages = await require('../models/Message').find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});
router.get('/:listingId', auth, getMessages);
router.post('/:listingId', auth, sendMessage);

module.exports = router;
