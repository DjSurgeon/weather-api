/**
 * @file app.js
 * @brief Main entry point for the wheather API.
 * @details This file initializes the Express application, configures middleware, and registers the API routes.
 * @author Sergio Jiménez de la Cruz
 * @date July 31, 2025
 * @version 0.1.0
 * @license MIT
 * @see {@link ./routes/weather.js} For the weather API routes.
 */

require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const weatherRoutes = require('./routes/weather');
const { generalLimiter, cityLimiter } = require('./middlewares/rateLimiter');

app.use(generalLimiter);
app.use('/weather', cityLimiter, weatherRoutes);
app.use('/', weatherRoutes);

/**
 * @brief Middleware to parse incoming JSON request.
 * @details This built-in middleware parses the `Content-Type: application/json`
 * header and makes the parsed JSON data available.
 */
app.use(express.json());

/**
 * @brief Middleware for logging incoming HTTP request.
 * @details This middleware logs the timestamp, HTTP method, and  URL for every incoming request.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 * It's useful for debugging and monitoring.
 */
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()} ${req.method} ${res.originalUrl}]`);
    next();
});

/**
 * @brief Defines a welcome route for the root endpoint.
 * @details Responds with a welcome message and list available API endpoints.
 * This is a good starting point for users to undestand what the API offers.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Weather API is running',
        endpoints: {
            status: '/status'
        }
    });
});

/**
 * @brief Route for the status endpoint.
 * @details Provides the current status of the API, environment, and a timestamp.
 * This endpoint is useful for health checks and monitoring.
 * @param {object} req - The Express request object.
 * @param {object} res - The Espress response object.
 */
app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

/**
 * @brief Handles request to undefined routes (404 not found).
 * @details This middleware should be placed at the end of all route definitions.
 * If a request reaches this point, it means no other route has haandled it.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function (not used,
 * but good practice to include).
 */
app.use((req, res, next) =>{
    res.status(404).json({
        error: 'route not found',
        message: `the route ${req.originalUrl} doesn't exit in the server`
    });
});

/**
 * @brief Global error handling middleware.
 * @details This middleware catches any errors that occurs during request processing.
 * It logs the error and sends a generic 500 internal server error response to the client.
 * For production, avoid sending detailed error mesagges to clients for security reasons.
 * @param {object} err - The error object.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function (uses to pass the
 * error if not handled here).
 */
app.use((err, req, res, next) => {
    console.error(`[ERROR]: ${err.stack || err.message}`);
    res.status(500).json({
        error: 'internal server error',
        message: err.message || 'something went wrong'
    });
})
/**
 * @brief Starts the Express server.
 * @details The server listens for incoming request on the specified PORT.
 * A callback function is executed once the server successfully starts, logging server details.
 */
app.listen(PORT, () => {
    console.log('\n===Express Server Running===');
    console.log('Environment: development');
    console.log(`Port: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
});