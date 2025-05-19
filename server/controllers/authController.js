const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }


        res.json({
            message: 'Login successful',
            username: user.username,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { username, password } = req.body;
    console.log('Request body:', req.body);

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { loginUser, registerUser };
