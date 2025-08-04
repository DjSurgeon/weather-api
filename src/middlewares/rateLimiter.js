/**
 * @file rateLimiter.js
 * @brief Provides configurable rate-limiting middleware for Express.
 * @details this module defines different rate limiters to protect the API from excessive request, preventing abuse and potential denial-of-service attacks.
 * @author Sergio Jiménez de la Cruz
 * @date August 4, 2025
 * @version 0.1.0
 * @license MIT
*/

require('dotenv').config();

const rateLimit = require('express-rate-limit');

const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || 100;
const RATE_LIMIT_WINDOW = process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000;
const RATE_LIMIT_CITY = process.env.RATE_LIMIT_CITY || 10 * 60 * 1000;

/**
 * @brief A general purpose rate limiter for the entire API.
 * @details Limits a single IP to `RATE_LIMIT_MAX` request within a `RATE_LIMIT_WINDOW` time frame.
 * @type {Function}
 */
let count = 0;
const generalLimiter = rateLimit(
	{
		windowMs: RATE_LIMIT_WINDOW,
	max: RATE_LIMIT_MAX,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: 'fail',
		statusCode: 429,
		error: 'Too many request',
		message: 'Rate Limit exceed'
	},
});

/**
 * @brief A specific rate limiter for the weather endpoint.
 * @details Limits a single IP to `RATE_LIMIT_MAX` request within a shorter `RATE_LIMIT_CITY` time frame.
 * This is useful for protecting specific, more expensive API calls.
 * @type {Function}
 */

const cityLimiter = rateLimit({
	windowMs: RATE_LIMIT_CITY,
	max: RATE_LIMIT_MAX,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: 'fail',
		statusCode: 429,
		error: 'Too many request',
		message: 'Rate Limit exceed'
	}
});

module.exports = { generalLimiter, cityLimiter };