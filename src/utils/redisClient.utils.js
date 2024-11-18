const { createClient } = require('redis');
require('dotenv').config();

// Create the Redis client
const redisClient = createClient({
    password: process.env.REDIS_PASS,  
    socket: {
        host: process.env.REDIS_HOST, 
        port: process.env.REDIS_PORT, 
    },
});

// Handling Redis connection events
redisClient.on('connect', () => {
    console.log('Successfully connected to Redis server');
});

// Handle errors that might occur during runtime
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

// Connect to Redis only if not already connected
const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log('Redis connection established');
        }
    } catch (err) {
        console.error('Redis connection failed:', err);
    }
};

connectRedis();

module.exports = redisClient;
