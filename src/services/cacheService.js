/**
 * @file cacheService.js
 * @brief Abstraction layer for Redis caching operations with TTL support.
 * @author Sergio Jiménez de la Cruz
 * @date August 3, 2025
 * @version 1.0.0
 * @license MIT
 * @see {@link ../config/redisConnection.js} for the Redis client configuration.
 */

require('dotenv').config();

const redisClient = require('../config/redisConnection');
const DEFAULT_TTL = process.env.REDIS_TTL || 43200;

/**
 * @brief Stores a key-value pair in Redis with an optional expiration time.
 * @details Automatically serializes the value to JSON to support objects and arrays.
 * @param {string} key - The unique key for the cache entry.
 * @param {any} value - The data to be cached.
 * @param {number} DEFAULT_TTL - The expiration time in seconds.
 * @returns {Promise<void>} A promise that resolves when the data is sucessfully set.
 * @throws {Error} Throws and error if the Redis operation fails.
 */
const setCache = async(key, value, ttl = DEFAULT_TTL) => {
	try{
		await redisClient.set(key, JSON.stringify(value), { EX: ttl });
	} catch(error) {
		console.error(`[RedisCache] Cache Set Error(key ${key}): ${error.message}`);
		throw new Error(`Failed to set cache for key: ${key}`);
	};
};

/**
 * @brief Retrieves data from Redis by its key.
 * @details Automatically deserializes the stored JSON data back into its original format.
 * @param {string} key - The key of the cache entry to retrieve.
 * @returns {Promise<any|null>} A promise that resolves with the cached data, or null if the key doesn't exists.
 * @throws {Error} Throws an error if the Redis operation fails.
 */
const getCache = async(key) => {
	try{
		const data = await redisClient.get(key);
		return data ? JSON.parse(data) : null;
	} catch(error) {
		console.error(`[RedisCache] Cache Get Error(key ${key}): ${error.message}`);
		throw new Error(`Failed to get cache for the key: ${key}`);
	};
};

/**
 * @brief Deletes a specific key from the Redis cache.
 * @param {string} key - The key of the cache entry to delete.
 * @returns {Promise<void>} A promise that resolves when the key is sucessfully deleted.
 * @throws {Error} Throws an error if the Redis operation fails.
 */
const deleteCache = async(key) => {
	try{
		await redisClient.del(key);
	} catch(error) {
		console.error(`[RedisCache] Cache Delete Error(key ${key}): ${error.message}`);
		throw new Error(`Failed to delete cache for key: ${key}`);
	}
};

module.exports = {
	setCache,
	getCache,
	deleteCache
};