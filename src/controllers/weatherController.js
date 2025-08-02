/**
 * @file weatherController.js
 * @brief This file contains the controller functions for the weather API.
 * It handles incoming request, validates parameters, and orcestrates calls to the weather service.
 * @author Sergio Jiménez de la Cruz
 * @date August 1, 2025
 * @version 0.1.0
 * @license MIT
 * @see {@link ../services/weatherService.js} For data fetching and transformation logic.
 */

const { fetchWeatherData, transformedData } = require('../services/weatherService');

/**
 * @brief Handles GET request to retrieve weather data for a specific city.
 * @details This function validates the city parameters, calls the weather service, and sends a standarized JSON response. It includes robust error handling.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @returns {void} Sends a JSON response to the client.
 */
const getWeatherData = async (req, res) => {
	const city = req.params.city;
	if (!city || typeof city !== 'string') {
		return res.status(400).json({
			error: 'Invalid request',
			message: 'City name is required and must be a valid string.'
		});
	};
	try {
		const weatherData = await fetchWeatherData(city);
		const modifiedData = transformedData(weatherData);
		res.status(200).json({
			status: 'success',
			data: modifiedData,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error(`Error: ${error.message}`);
		return res.status(500).json({
			error: 'Internal server error',
			message: error.message
		});
	};
};

module.exports = { getWeatherData };