/**
 * @file redisConnection.js
 * @brief Configures and exports Redis client with connection handling.
 * @author Sergio Jiménez de la Cruz
 * @date August 2, 2025
 * @version 0.1.0
 * @license MIT
 */

require('dotenv').config();

const redis = require('redis');

const redisClient = redis.createClient({
	url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.on('error', (err) => console.error('Redis error', err));
redisClient.on('connect', () => console.log('Redis connected'));
redisClient.connect();

module.exports = redisClient;