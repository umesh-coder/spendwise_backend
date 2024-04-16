const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");


/**
 * @method ensureauth
 * @param {*} req - The request object containing the incoming HTTP request from the client.
 * @param {*} res - The response object used to send HTTP responses back to the client.
 * @param {*} next - The next middleware function in the Express middleware chain (optional).
 * @description This middleware function is used to ensure that the user is authorized by validating the JWT token present in the request headers.
 * @returns {void} Returns nothing. It either passes control to the next middleware function in the chain if the user is authorized, or sends an error response to the client.
 * If the user is not authorized due to missing or invalid token, it returns an appropriate error message and sets the HTTP status code:
 * - 403: Forbidden - When the token is missing or not provided in the request headers.
 * - 403: Forbidden - When the token is not valid or expired.
 * - 403: Forbidden - When the user ID in the token does not match the user ID in the database.
 * @example
 * // Sample usage in a route handler:
 * app.get('/protected-route', ensureauth, (req, res) => {
 *     // This code will only execute if the user is authorized (i.e., the JWT token is valid)
 *     res.send('You are authorized to access this protected route.');
 * });
 */

const ensureauth = async (req, res, next) => {
    console.log("hello middleware");
    const token = req.headers["authorization"];
    // req.userData = { id: localStorage.getItem('Id').split(' ')[1] };
    console.log("middleWare token:" + token);
    if (!token) {
        return res.status(403).json({ message: "Token is Required" });
    }
    try {
        const decoded = jwt.verify(
            req.headers["authorization"].split(' ')[1],
            process.env.JWT_KEY
        );

        //display user id
        // console.log("id:-" + decoded.userId);

        // Find the user based on the email extracted from the decoded token
        const user = await UserModel.findOne({ email: decoded.email });


        // console.log("id2:-" + user._id);

        // If user is not found or user ID does not match, return 403
        if (!user || (user._id).toString() !== (decoded.userId).toString()) {
            return res.status(403).json({ message: "User ID in token does not match user ID in headers" });
        }
        req.decoded = decoded

        return next();
    } catch (error) {
        return res.status(403).json({ message: "Token is Not Valid or Expired" });
    }
    
};


module.exports = {
    ensureauth
};
