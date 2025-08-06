/**
 * @file weatherController.js
 * @brief This file contains the controller functions for the weather API.
 * @details It handles incoming request, validates parameters, and orcestrates calls to the weather service.
 * @author Sergio Jiménez de la Cruz
 * @date August 1, 2025
 * @version 1.0.0
 * @license MIT
 * @see {@link ../services/weatherService.js} For data fetching and transformation logic.
 * @see {@link ../services/cacheService.js} For Redis caching operations.
 */

const { fetchWeatherData, transformedData } = require('../services/weatherService');
const { getCache, setCache } = require('../services/cacheService');

/**
 * @brief Handles GET request to retrieve weather data for a specific city.
 * @details This function validates the city parameters, then checks the cache for the existing data. If not found it fetches the data from the external API, stores it in the cache, and then sends a standarized JSON response. It includes robust error handling.
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
	const cachedKey = `weather:${city.toLowerCase().trim()}`;
	try {
		const cachedData = await getCache(cachedKey);
		if (cachedData) {
			const modifiedData = transformedData(cachedData);
			return res.status(200).json({
				status: 'success',
				source: 'cache',
				data: modifiedData,
				timestamp: new Date().toISOString()
			})
		};
		const weatherData = await fetchWeatherData(city);
		await setCache(cachedKey, weatherData);
		const modifiedData = transformedData(weatherData);
		res.status(200).json({
			status: 'success',
			source: 'API',
			data: modifiedData,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error(`[WeatherController] Failed to fetch data for city: ${city}`);
		return res.status(500).json({
			error: 'Internal server error',
			message: error.message
		});
	};
};

module.exports = { getWeatherData };