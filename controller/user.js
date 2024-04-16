

//External Dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//Internal Dependencies
const UserModel = require("../models/userModel");
const { checkparamsidwithheaderid } = require('../utils/checkparamsidwithheaderid')


//exports module
module.exports = {

    /**
   * @method signup
   * @param {*} req - The request object containing parameters for user signup.
   * @param {*} res - The response object used to send the response back to the client.
   * @param {*} next - The next middleware function in the Express middleware chain (optional).
   * @description This method is used to register a new user.
   * It expects the following parameters in the request body:
   * - name: Name of the user.
   * - username: Username chosen by the user.
   * - email: Email address of the user.
   * - password: Password chosen by the user.
   * - userfirstsignupdate: Date of the user's first sign-up.
   * - category: Categories associated with the user (optional).
   * @returns {Object} Returns a JSON object with the following structure:
   * {
   *    message: String, // Describes the outcome of the operation.
   *    token: String, // JWT token for authentication.
   *    userId: String, // ID of the newly created user.
   * }
   * If successful, it returns:
   * {
   *    message: "User created successfully",
   *    token: "JWT token",
   *    userId: "ID of the newly created user",
   * }
   * If there's an error during the operation, it returns an appropriate error message, along with the HTTP status code:
   * - 500: Internal Server Error - When there's an unexpected error or failure during the operation.
   * @example
   * // Sample request URL: POST /api/signup
   * // Sample request body:
   * {
   *    "name": "John Doe",
   *    "username": "john_doe",
   *    "email": "john@example.com",
   *    "password": "password123",
   *    "userfirstsignupdate": "2024-03-22",
   *    "category": ["Food", "Transportation"]
   * }
   * @example
   * // Sample response for successful operation:
   * {
   *    "message": "User created successfully",
   *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2NDk2MzE5NzUsImV4cCI6MTY0OTYzNTU3NX0.zwEAlaJ2ukEhTmH9RcJq4a8QRBev_YpFZq1_9w_fGcI",
   *    "userId": "6091d4a399f4d3001f2a228b"
   * }
   * @example
   * // Sample response for unsuccessful operation:
   * {
   *    "message": "Failed to create user",
   *    "error": "Error message"
   * }
   */
    signup: async (req, res, next) => {
        console.log("yah ho");

        try {
            // Hash the password before saving it to the database
            const hash = await bcrypt.hash(req.body.password, 10);

            // Create a new user object
            const newUser = new UserModel({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: hash,
                userfirstsignupdate: req.body.userfirstsignupdate,
                category: req.body.category,
            });

            // Save the user to the database
            const savedUser = newUser.save()
                .then((result) => {
                    const token = jwt.sign(
                        { email: req.email },
                        process.env.JWT_KEY,
                        { expiresIn: '1h' } // 1 hour
                    );
                    res.status(200).json({
                        message: "Account Created",
                        status: true,
                        data: {
                            UserSince: result.userfirstsignupdate,
                            username: result.username,
                            name: result.name,
                            token: token,
                            expiredToken: 3600,
                            userid: result._id,
                        },
                    });
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).json({
                        message: 'Failed to create user',
                        error: err.message,
                    });
                });

        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({
                message: 'Failed to create user',
                error: error.message
            });
        }
    },

    /**
    * @method login
    * @param {*} req - The request object containing parameters for user login.
    * @param {*} res - The response object used to send the response back to the client.
    * @param {*} next - The next middleware function in the Express middleware chain (optional).
    * @description This method is used to authenticate a user during login.
    * It expects the following parameters in the request body:
    * - email: Email address of the user.
    * - password: Password provided by the user.
    * @returns {Object} Returns a JSON object with the following structure:
    * {
    *    message: String, // Describes the outcome of the operation.
    *    data: Object, // Contains additional data such as token, latest login date, user ID, and token expiration time.
    *    status: Boolean, // Indicates the success or failure of the operation.
    * }
    * If successful, it returns:
    * {
    *    message: "Login Successfully!",
    *    data: {
    *        token: "JWT token",
    *        latestLoginDate: "Date and time of the latest login",
    *        userId: "ID of the user",
    *        expiredToken: "Token expiration time in seconds"
    *    },
    *    status: true,
    * }
    * If the provided email address or password is invalid, it returns:
    * {
    *    message: "Invalid Email Address or Password",
    *    status: false,
    * }
    * If there's an error during the operation, it returns an appropriate error message and sets the status to false, along with the HTTP status code:
    * - 401: Unauthorized - When the provided email address is invalid.
    * - 500: Internal Server Error - When there's an unexpected error or failure during the operation.
    * @example
    * // Sample request URL: POST /api/login
    * // Sample request body:
    * {
    *    "email": "john@example.com",
    *    "password": "password123"
    * }
    * @example
    * // Sample response for successful operation:
    * {
    *    "message": "Login Successfully!",
    *    "data": {
    *        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJ1c2VySWQiOiI2MDkxZDRhMzk5ZjRkMzAwMWYyYTIyOGIiLCJpYXQiOjE2NDk2MzQ0OTQsImV4cCI6MTY0OTYzODA5NH0.5Vak-MXTrdI5jsJbbltCHNfO-QmS7qCJ0rWoxUzExAc",
    *        "latestLoginDate": "2024-03-23T08:03:14.000Z",
    *        "userId": "6091d4a399f4d3001f2a228b",
    *        "expiredToken": 3600
    *    },
    *    "status": true
    * }
    * @example
    * // Sample response for unsuccessful operation:
    * {
    *    "message": "Invalid Email Address or Password",
    *    "status": false
    * }
    */


    login: async (req, res, next) => {
        console.log("login hello");
        try {
            // Find the user in the database by their email
            const user = await UserModel.findOne({ email: req.body.email });

            // If the user is not found, return an error
            if (!user) {
                return res.status(401).json({
                    message: "Invalid Email Address",
                    status: false,
                });
            }

            // Compare the provided password with the stored hashed password
            const validate = await bcrypt.compare(req.body.password, user.password);

            // If the password is not valid, return an error
            if (!validate) {
                return res.status(401).json({
                    message: "Invalid Email Address or Password",
                    status: false,
                });
            }

            // Generate JWT token for authentication
            const token = jwt.sign(
                { email: user.email, userId: user._id },
                process.env.JWT_KEY,
                { expiresIn: '23h' } // Token expires in 1 hour
            );


            console.log("login token" + token);
            // Respond with success message, token, and user ID
            res.status(200).json({
                message: "Login Successfully!",
                data: {
                    token: token,
                    latestLoginDate: new Date(),
                    userid: user._id,
                    expiredToken: 3600,
                },

                status: true,
            });


        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({
                message: "Something went wrong! Please try again",
                status: false,
            });
        }
    },

    /**
  * @method deleteaccount
  * @param {*} req - The request object containing parameters for deleting a user account.
  * @param {*} res - The response object used to send the response back to the client.
  * @param {*} next - The next middleware function in the Express middleware chain (optional).
  * @description This method is used to delete a user account from the system.
  * It expects the following parameter in the request:
  * - id: ID of the user whose account will be deleted (passed as a route parameter).
  * @returns {Object} Returns a JSON object with the following structure:
  * {
  *    message: String, // Describes the outcome of the operation.
  *    status: Boolean, // Indicates the success or failure of the operation.
  * }
  * If successful, it returns:
  * {
  *    message: "Successfully deleted account",
  *    status: true,
  * }
  * If the specified user is not found, it returns:
  * {
  *    message: "User not found",
  *    status: false,
  * }
  * If there's an error during the operation, it returns an appropriate error message and sets the status to false, along with the HTTP status code:
  * - 401: Unauthorized - When the user ID in the token does not match the user ID in the headers.
  * - 404: Not Found - When the specified user is not found.
  * - 500: Internal Server Error - When there's an unexpected error or failure during the operation.
  * @example
  * // Sample request URL: DELETE /api/deleteaccount/user/1234567890
  * @example
  * // Sample response for successful operation:
  * {
  *    "message": "Successfully deleted account",
  *    "status": true
  * }
  * @example
  * // Sample response for unsuccessful operation (user not found):
  * {
  *    "message": "User not found",
  *    "status": false
  * }
  */

    deleteaccount: async (req, res, next) => {
        try {
           
            const id = req.params.id
            const tempboolean = checkparamsidwithheaderid(req, res, id)

            if (tempboolean) {
                return res.status(401).json({ message: "User ID in token does not match user ID in headers1" });
            }

            // Find the user in the database by their ID and delete them
            const result = await UserModel.findOneAndDelete({ _id: req.params.id });

            // If the user is not found, return an error
            if (!result) {
                return res.status(404).json({
                    message: "User not found",
                    status: false,
                });
            }

            // Respond with success message
            res.status(200).json({
                message: "Successfully deleted account",
                status: true,
            });

        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({
                message: "Internal Server Error",
                status: false,
            });
        }
    }

}