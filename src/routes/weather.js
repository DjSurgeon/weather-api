/**
 * @file weather.js
 * @brief This file defines the API routes for handling weather-related requests.
 * @details It serves as routing layer, mapping HTTP request to the appropriate controller functions.
 * @author Sergio Jiménez de la Cruz
 * @date August 1, 2025
 * @version 1.0.0
 * @license MIT
 * @see {@link ../controllers/weatherController.js} For the business logic associated with these routes.
 */

const express = require('express');
const router = express.Router();
const { getWeatherData } = require('../controllers/weatherController');
const validateCity = require('../middlewares/validateCity');

/**
 * @brief GET route to the fetch weather data for a specific city.
 * @details Defines a dynamic route using a URL parameter ':city'.
 * This route calls the getWeatheData controller function to handle the request.
 * The URL parameter is then accessible via `req.params.city` in the controller.
 */
router.get('/:city', validateCity, getWeatherData);

module.exports = router;