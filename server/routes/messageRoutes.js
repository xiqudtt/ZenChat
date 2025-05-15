const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMessagesByRoom, saveMessage } = require('../controllers/messageController');
const router = express.Router();

router.get('/:roomId', protect, getMessagesByRoom);
router.post('/', protect, saveMessage);

module.exports = router;