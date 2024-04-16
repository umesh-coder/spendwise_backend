// External Dependencies
/**
 * Express application instance.
 * @type {express}
 */
const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());

/**
 * Middleware for parsing JSON bodies.
 * @type {body-parser}
 */
const bodyParser = require("body-parser");

/**
 * User routes.
 * @type {Object}
 */
const user = require("./routes/user");

/**
 * Expense routes.
 * @type {Object}
 */
const expense = require("./routes/expense");

/**
 * Group routes.
 * @type {Object}
 */
const group = require("./routes/group");



const groupExpense=require("./routes/groupExpense");

// Internal dependencies
/**
 * Loads environment variables from .env file.
 */
require("dotenv").config();

/**
 * Database connection promise.
 * @type {Promise}
 */
const dbConnection = require("./config/db");

// Importing Port
/**
 * Port number for the server to listen on.
 * @type {number}
 */
const Port = process.env.Port || 2000;

// Import the routes
/**
 * Middleware for parsing JSON bodies.
 */
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,authentication",
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,DELETE,PATCH,OPTIONS"
    );
    next();
});

/**
 * User authentication routes.
 */
app.use("/auth", user);

/**
 * Expense management routes.
 */
app.use("/expense", expense);

/**
 * Group management routes.
 */
app.use("/group", group)

/**
 * GroupExpense management routes.
 */
 app.use("/groupExpense",groupExpense)

// Catch all unhandled routes
/**
 * Middleware to catch all unhandled routes and respond with a 404 error.
 */
app.use((req, res, next) => {
    res.status(404).send({ error: "Route not found" });
});

// Catch all uncaught and unhandled errors
/**
 * Event listener for uncaught exceptions to handle them gracefully.
 */
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1); // Exit process with failure
});

// Set up error handling middleware
/**
 * Middleware for handling errors.
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something broke!" });
});

// Start the server after the database connection is successful
/**
 * Starts the server and listens on the specified port after the database connection is successful.
 * Handles errors that occur when the server starts listening.
 */




// Start the server after the database connection is successful
dbConnection.then((connected) => {
    if (connected) {
        const server = app.listen(Port, () => {
            console.log("🚀 Server is running 🚀 On Port:- " + Port)
        })

        server.on("error", (error) => {
            console.error("Error starting server:", error)
            process.exit(1)  // Exit process with failure
        });
    } else {
        console.error(" 🥺 Server cannot start because database connection failed. 🥺 ")
    }
}).catch((error) => {
    console.error("Failed to start server due to database connection error:", error)
    process.exit(1) // Exit process with failure
})