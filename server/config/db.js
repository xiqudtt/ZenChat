const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log('MongoDB connected...'))
            .catch(err => {
                console.error('MongoDB connection error:', err.message);
                process.exit(1);
            });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;