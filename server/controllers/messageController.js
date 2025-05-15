const Message = require('../models/Message');

// @desc    Get messages by room
// @route   GET /api/messages/:roomId
const getMessagesByRoom = async (req, res) => {
    try {
        const messages = await Message.find({ roomId: req.params.roomId })
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Save message
// @route   POST /api/messages
const saveMessage = async (req, res) => {
    const { roomId, sender, text } = req.body;

    if (!roomId || !text) {
        return res.status(400).json({ message: 'Room ID and text are required' });
    }

    try {
        const message = await Message.create({ roomId, sender, text });
        res.status(201).json(message);
    } catch (error) {
        console.error('Error saving message:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getMessagesByRoom, saveMessage };