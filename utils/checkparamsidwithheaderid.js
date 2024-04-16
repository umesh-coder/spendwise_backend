const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");


/**
 * @description Function to check if the user ID in the request parameters matches the user ID in the JWT token
 * @param {*} req - The request object containing the incoming HTTP request from the client.
 * @param {*} res - The response object used to send HTTP responses back to the client.
 * @param {*} id - The user ID extracted from the request parameters.
 * @returns {boolean} Returns true if the user ID in the token does not match the user ID in the request parameters, otherwise returns false.
 */

const checkparamsidwithheaderid = (req, res, id) => {
    const token = req.headers["authorization"];
    try {
        const decoded = jwt.verify(req.headers["authorization"].split(' ')[1], process.env.JWT_KEY);

        // console.log("id test1:-" + decoded.userId);
        // console.log("id test2:-" + id.toString());

        // If user is not found or user ID does not match, return 403
        if (id.toString() !== decoded.userId.toString()) {
            console.log("wrong user");
            return true
        } else {

            return false
        }


    } catch (error) {
        console.error(error);

    }
};

module.exports = {
    checkparamsidwithheaderid
};
