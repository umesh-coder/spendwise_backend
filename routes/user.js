//external dependencies
const express = require("express");
const routes = express.Router();

//internal dependencies
const { signup, login, deleteaccount } = require("../controller/user")
// const { createexpense } = require("../controller/expense")
const { ensureauth } = require("../middleware/middleware")
const { validateSignup, validateLogin } = require('../utils/validator'); // Adjust the path as necessary



//signup Route
routes.post("/signup", validateSignup, signup);

//login Route
routes.post("/login", validateLogin, login)

//delete account route
routes.delete("/delete/:id", ensureauth, deleteaccount)

//exporting Route
module.exports = routes;
