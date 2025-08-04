/**
 * @file validateCity.js
 * @brief Middleware for validating the 'city' URL parameter.
 * @detils This module defines a validation chain and an error-handling middleware to ensure that the city parameter is valid and safe to use.
 * @author Sergio Jiménez de la Cruz
 * @date August 4, 2025
 * @version 0.1.0
 * @license MIT
 */

const { param, validationResult} = require('express-validator');

/**
 * @brief A middleware array for validating and sanitizing the 'city' URL parameter.
 * @details This array contains a validation chain followed by a custom middleware to check for validation error and send a standardized JSON response if the exits.
 * @type {Array<Function>}
 */
const validateCity = [
	param('city')
	.notEmpty().withMessage('City name is required')
	.isString().withMessage('City must be a string')
	.trim()
	.toLowerCase()
	.isLength({min: 2, max: 25}).withMessage('City name must be between 2-25 characters')
	.matches(/^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']+$/i).withMessage('City name contains invalid characters')
	.escape(),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				status: 'fail',
				error: 'Invalid input',
				details: errors.array(),
			});
		}
		next();
	},
];

module.exports = validateCity;