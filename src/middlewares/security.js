/**
 * @file security.js
 * @brief This module provides a set of securityand logging middleware for Express applications.
 * @details It configures 'CORS', 'Helmet' for various security headers, and 'Morgan' for request logging.
 * @author Sergio Jiménez de la Cruz
 * @date August 5, 2025
 * @version 1.0.0
 * @license MIT
 * @see {@link ../app.js} The main application file where this middleware will be used.
 */

require('dotenv').config();

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

/**
 * @brief Configuration object for the CORS middleware.
 * @details This object defines the allowed origins, HTTP methods, and headers for cross-origin request.
 */
const corsOptions = {
	origin: process.env.CLIENT_URL || 'http://localhost:3000',
	methods: ['GET', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	optionsSuccessStatus: 204
};

/**
 * @brief Configuration object for the Helmet middleware.
 * @details This object defines a set of security-enhancing HTTP headers to protect against common web vulnerabilities.
 */
const helmetOptions = {
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
			styleSrc: ["'self'"]
		}
	},
	referrerPolicy: { policy: 'same-origin'},
	crossOriginResourcePolicy: { policy: 'same-origin'}
};

/**
 * @brief A function to apply all security middleware to the Express application.
 * @param {object} app - The main Express application instance.
 * @returns {void}
 */
const setupSecurityMiddleware = (app) => {
	app.use(morgan('combined'));
	app.use(cors(corsOptions));
	app.use(helmet(helmetOptions));
}

module.exports = setupSecurityMiddleware;