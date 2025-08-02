/**
 * @file weatherService.js
 * @brief This module provides functions for fetching and processing weather data from the Visual Crossing API.
 * @author Sergio Jiménez de la Cruz
 * @date August 1, 2025
 * @version 0.1.0
 * @license MIT
 */

require('dotenv').config();

const axios = require('axios');

const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
const API_KEY = process.env.API_KEY;

/**
 * @brief Fetches real-time weather data for a specified city.
 * @param {string} city - The name of the city to retrieve weather data for. 
 * @returns {Promise<object>} A promise that resolves with the raw API data.
 * @throws {Error} Throws an error if the API request fails (network issues, API errors).
 */
const fetchWeatherData = async (city) => {
	try {
		if (!city) {
			throw new Error('city name is required');
		}
		const url = `${BASE_URL}${encodeURIComponent(city)}?key=${API_KEY}&unitGroup=metric`;
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.error('Error:', error.message);
		if (error.response) {
			throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || 'Unknow Error'}`);
		} else if (error.request) {
			throw new Error('Conection Error');
		} else {
			throw new Error(`Internal error: ${error.message}`);
		}
	}
};

/**
 * @brief Transforms the raw API response into a clean, simpolified data object.
 * @param {object} rawData - The raw data object returned from the Visual Crossing API.
 * @returns {object} A simplified weather data object.
 * @throws {Error} Throws an error if the raw data is invalid or incomplete.
 */
const transformedData = (rawData) => {
	const dayData = rawData.days[0];
	if (!rawData || !dayData)
	{
		throw new Error('No weather data available');
	}
	return {
		city: rawData.resolvedAddress,
		latitude: rawData.latitude,
		longitude: rawData.longitude,
		timezone: rawData.timezone,
		date: dayData.datetime,
		temperature: dayData.temp,
		description: dayData.conditions,
		humidity: dayData.humidity,
		windSpeed: dayData.windspeed
	}
}

module.exports = { fetchWeatherData, transformedData };