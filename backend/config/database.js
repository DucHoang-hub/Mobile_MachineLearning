const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
        });
        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        isConnected = false;
        console.warn(`⚠️  MongoDB not available: ${error.message}`);
        console.warn('📦 Falling back to In-Memory mode...');
        return false;
    }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
