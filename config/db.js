// External Dependencies
/**
 * Mongoose library for MongoDB object modeling.
 * @type {mongoose}
 */
const mongoose = require("mongoose");

/**
 * MongoDB connection URL.
 * @type {string}
 */
const url = process.env.MONGO_URL;

// Connecting Database and exporting the connection promise
/**
 * Establishes a connection to the MongoDB database.
 * Logs success or error messages based on the connection status.
 * @returns {Promise} A promise that resolves when the connection is successful.
 */
const dbConnection = mongoose.connect(url)
    .then(() => {
        console.log("🚀 Mongo Database is Connected Successfully..... 🚀");
        return true; // Database connection successful
    })
    .catch((err) => {
        console.error(" 🥺 Mongo Database Connection Error:", err);
        return false; // Database connection failed
    });

module.exports = dbConnection;