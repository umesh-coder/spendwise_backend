
//interal dependencies
const CreateExpense = require("../models/createExpense");
const SaveData = require('../models/saveData');
const UserModel = require('../models/userModel');
const { checkparamsidwithheaderid } = require('../utils/checkparamsidwithheaderid')

//exports module
module.exports = {

    /**
     * @method createExpense
     * @param {*} req - The request object containing data for creating the expense.
     * @param {*} res - The response object used to send the response back to the client.
     * @description This method is used to create a new expense. It expects the following parameters in the request body:
     * - name: Name of the expense.
     * - amount: Amount of the expense.
     * - expense_date: Date of the expense.
     * - expense_category: Category of the expense.
     * - payment: Payment method used for the expense.
     * - comment: Optional comment for the expense.
     * - userid: ID of the user associated with the expense.
     * @returns {Object} Returns a JSON object with the following structure:
     * {
     *    message: String, // Describes the outcome of the operation.
     *    status: Boolean, // Indicates the success or failure of the operation.
     * }
     * If successful, it returns:
     * {
     *    message: 'Expense Added',
     *    status: true,
     * }
     * If there's an error, it returns an appropriate error message and sets the status to false, along with the corresponding HTTP status code:
     * - 401: Unauthorized - When the user ID in the token does not match the user ID in the headers.
     * - 501: Not Implemented - When there's an unexpected error or failure during the operation.
     * @example
     * // Sample request body:
     * {
     *    "name": "Groceries",
     *    "amount": 50.00,
     *    "expense_date": "2024-03-22",
     *    "expense_category": "Food",
     *    "payment": "Credit Card",
     *    "comment": "Weekly groceries shopping",
     *    "userid": "1234567890"
     * }
     * @example
     * // Sample response for successful operation:
     * {
     *    "message": "Expense Added",
     *    "status": true
     * }
     * @example
     * // Sample response for unauthorized request:
     * {
     *    "message": "User ID in token does not match user ID in headers",
     *    "status": false
     * }
     */

    // POST endpoint to create a new expense
    createexpense: async (req, res) => {

        // Extract data from the request body
        const { name, amount, expense_date, expense_category, payment, comment, userid } = req.body;

        const id = userid
        const tempboolean = checkparamsidwithheaderid(req, res, id)

        if (tempboolean) {
            return res.status(401).json({ message: "User ID in token does not match user ID in headers1" });
        }

        // Create a new expense instance
        const newExpense = new CreateExpense({
            name,
            amount,
            expense_date,
            expense_category,
            payment,
            comment,
            userid
        });

        UserModel.updateOne({ _id: userid }, {
            $push: { expenses: newExpense }
        }).then((result) => {
            res.status(200).json({
                message: 'Expense Added',
                status: true,
            })
            console.log(result);
        }).catch((err) => {
            res.status(501).json({
                message: err,
                status: false,
            });
        });
    },

    /**
     * @method getallexpenses
     * @param {*} req - The request object containing parameters for fetching expenses.
     * @param {*} res - The response object used to send the response back to the client.
     * @description This method is used to retrieve all expenses associated with a specific user.
     * It expects the following parameter in the request:
     * - id: ID of the user whose expenses are to be fetched (passed as a route parameter).
     * @returns {Object} Returns a JSON object with the following structure:
     * {
     *    message: String, // Describes the outcome of the operation.
     *    data: Array, // Contains the array of expenses if the operation is successful.
     *    status: Boolean, // Indicates the success or failure of the operation.
     * }
     * If successful, it returns:
     * {
     *    message: "Successfully Fetched",
     *    data: [Array of expenses],
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
     * // Sample request URL: GET /api/expenses/user/1234567890
     * @example
     * // Sample response for successful operation:
     * {
     *    "message": "Successfully Fetched",
     *    "data": [
     *        {
     *            "name": "Groceries",
     *            "amount": 50.00,
     *            "expense_date": "2024-03-22",
     *            "expense_category": "Food",
     *            "payment": "Credit Card",
     *            "comment": "Weekly groceries shopping",
     *            "userid": "1234567890",
     *            "_id": "60f21cb86f8b8e0039bd66a9",
     *            "createdAt": "2024-07-15T08:00:00.000Z",
     *            "updatedAt": "2024-07-15T08:00:00.000Z",
     *            "__v": 0
     *        },
     *        // Additional expenses...
     *    ],
     *    "status": true
     * }
     * @example
     * // Sample response for unauthorized request:
     * {
     *    "message": "User ID in token does not match user ID in headers",
     *    "status": false
     * }
     */

    getallexpenses: async (req, res) => {
        try {
            const id = req.params.id
            const tempboolean = checkparamsidwithheaderid(req, res, id)

            if (tempboolean) {
                return res.status(401).json({ message: "User ID in token does not match user ID in headers1" });
            }


            // const user = await UserModel.findOne({ _id: req.params.id });
            // if (!user) {
            //     return res.status(404).json({
            //         message: "User not found",
            //         status: false,
            //     });
            // }
            // res.status(200).json({
            //     message: "Successfully Fetched",
            //     data: user.expenses,
            //     status: true,
            // });

            UserModel.findOne({ _id: req.params.id }).then((documents) => {
                console.log(documents);
                res.status(200).json({
                    message: "SuccessFully Fetched",
                    data: documents.expenses,
                    status: true,
                });
            }).catch((err) => {
                res.status(401).json({
                    message: err,
                    status: false,
                });
            })

        } catch (err) {
            res.status(500).json({
                message: err.message || "Internal Server Error",
                status: false,
            });
        }
    },

    /**
     * @method getsingleexpense
     * @param {*} req - The request object containing parameters for fetching a single expense.
     * @param {*} res - The response object used to send the response back to the client.
     * @description This method is used to retrieve a single expense associated with a specific user.
     * It expects the following parameters in the request:
     * - userId: ID of the user whose expense is to be fetched (passed as a route parameter).
     * - id: ID of the expense to be fetched (passed as a route parameter).
     * @returns {Object} Returns a JSON object with the following structure:
     * {
     *    message: String, // Describes the outcome of the operation.
     *    data: Object, // Contains the expense object if the operation is successful.
     *    status: Boolean, // Indicates the success or failure of the operation.
     * }
     * If successful, it returns:
     * {
     *    message: "Fetch one",
     *    data: {Single expense object},
     *    status: true,
     * }
     * If the specified user or expense is not found, it returns:
     * {
     *    message: "User or expense not found",
     *    status: false,
     * }
     * If there's an error during the operation, it returns an appropriate error message and sets the status to false, along with the HTTP status code:
     * - 401: Unauthorized - When the user ID in the token does not match the user ID in the headers.
     * - 404: Not Found - When the specified user or expense is not found.
     * - 500: Internal Server Error - When there's an unexpected error or failure during the operation.
     * @example
     * // Sample request URL: GET /api/expenses/user/1234567890/expense/0987654321
     * @example
     * // Sample response for successful operation:
     * {
     *    "message": "Fetch one",
     *    "data": {
     *        "_id": "0987654321",
     *        "name": "Groceries",
     *        "amount": 50.00,
     *        "expense_date": "2024-03-22",
     *        "expense_category": "Food",
     *        "payment": "Credit Card",
     *        "comment": "Weekly groceries shopping",
     *        "userid": "1234567890",
     *        "createdAt": "2024-07-15T08:00:00.000Z",
     *        "updatedAt": "2024-07-15T08:00:00.000Z",
     *        "__v": 0
     *    },
     *    "status": true
     * }
     * @example
     * // Sample response for unauthorized request:
     * {
     *    "message": "User ID in token does not match user ID in headers",
     *    "status": false
     * }
     */

    getsingleexpense: async (req, res) => {
        try {

            const id = req.params.userId
            const tempboolean = checkparamsidwithheaderid(req, res, id)

            if (tempboolean) {
                return res.status(401).json({ message: "User ID in token does not match user ID in headers1" });
            }

            const user = await UserModel.findOne({ _id: req.params.userId, 'expenses._id': req.params.id }, { 'expenses.$': 1 });

            if (!user) {
                return res.status(404).json({
                    message: "User or expense not found",
                    status: false,
                });
            }

            res.status(200).json({
                message: 'Fetch one',
                data: user.expenses[0],
                status: true,
            });
        } catch (err) {
            res.status(500).json({
                message: err.message || "Internal Server Error",
                status: false,
            });
        }
    },

    /**
     * @method updateexpense
     * @param {*} req - The request object containing parameters for updating an expense.
     * @param {*} res - The response object used to send the response back to the client.
     * @param {*} next - The next middleware function in the Express middleware chain (optional).
     * @description This method is used to update an existing expense associated with a specific user.
     * It expects the following parameters in the request:
     * - userId: ID of the user whose expense is to be updated (passed as a route parameter).
     * - id: ID of the expense to be updated (passed as a route parameter).
     * @returns {Object} Returns a JSON object with the following structure:
     * {
     *    message: String, // Describes the outcome of the operation.
     *    status: Boolean, // Indicates the success or failure of the operation.
     * }
     * If successful, it returns:
     * {
     *    message: "Successfully Updated",
     *    status: true,
     * }
     * If the specified user or expense is not found, it returns:
     * {
     *    message: "User or expense not found",
     *    status: false,
     * }
     * If there's an error during the operation, it returns an appropriate error message and sets the status to false, along with the HTTP status code:
     * - 401: Unauthorized - When the user ID in the token does not match the user ID in the headers.
     * - 404: Not Found - When the specified user or expense is not found.
     * - 500: Internal Server Error - When there's an unexpected error or failure during the operation.
     * @example
     * // Sample request URL: PUT /api/expenses/user/1234567890/expense/0987654321
     * // Sample request body:
     * {
     *    "name": "Updated Groceries",
     *    "amount": 60.00,
     *    "expense_date": "2024-03-25",
     *    "expense_category": "Groceries",
     *    "payment": "Debit Card",
     *    "comment": "Updated weekly groceries shopping"
     * }
     * @example
     * // Sample response for successful operation:
     * {
     *    "message": "Successfully Updated",
     *    "status": true
     * }
     * @example
     * // Sample response for unauthorized request:
     * {
     *    "message": "User ID in token does not match user ID in headers",
     *    "status": false
     * }
     */

    updateexpense: async (req, res, next) => {
        try {

            const id = req.params.userId
            const tempboolean = checkparamsidwithheaderid(req, res, id)

            if (tempboolean) {
                return res.status(401).json({ message: "User ID in token does not match user ID in headers" });
            }


            console.log("body of update " + req.body.amount);

            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: req.params.userId, 'expenses._id': req.params.id },
                {
                    $set: {
                        'expenses.$.name': req.body.name,
                        'expenses.$.amount': req.body.amount,
                        'expenses.$.expense_date': req.body.expense_date,
                        'expenses.$.expense_category': req.body.expense_category,
                        'expenses.$.payment': req.body.payment,
                        'expenses.$.comment': req.body.comment
                    }
                },
                { new: true }//new:true ko false kiya
            );

            if (!updatedUser) {
                return res.status(404).json({
                    message: "User or expense not found",
                    status: false,
                });
            }

            console.log(updatedUser);
            res.status(200).json({
                message: "Successfully Updated",
                status: true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error.message || "Internal Server Error",
                status: false,
            });
        }
    },

    /**
   * @method deleteexpense
   * @param {*} req - The request object containing parameters for deleting an expense.
   * @param {*} res - The response object used to send the response back to the client.
   * @param {*} next - The next middleware function in the Express middleware chain (optional).
   * @description This method is used to delete an existing expense associated with a specific user.
   * It expects the following parameters in the request:
   * - userId: ID of the user whose expense is to be deleted (passed as a route parameter).
   * - id: ID of the expense to be deleted (passed as a route parameter).
   * @returns {Object} Returns a JSON object with the following structure:
   * {
   *    message: String, // Describes the outcome of the operation.
   *    status: Boolean, // Indicates the success or failure of the operation.
   * }
   * If successful, it returns:
   * {
   *    message: "Expense deleted successfully",
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
   * // Sample request URL: DELETE /api/expenses/user/1234567890/expense/0987654321
   * @example
   * // Sample response for successful operation:
   * {
   *    "message": "Expense deleted successfully",
   *    "status": true
   * }
   * @example
   * // Sample response for unauthorized request:
   * {
   *    "message": "User ID in token does not match user ID in headers",
   *    "status": false
   * }
   */


    deleteexpense: async (req, res, next) => {
        try {

            const id = req.params.userId
            const tempboolean = checkparamsidwithheaderid(req, res, id)

            if (tempboolean) {
                return res.status(401).json({ message: "User ID in token does not match user ID in headers1" });
            }

            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { expenses: { _id: req.params.id } } },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({
                    message: "User not found",
                    status: false,
                });
            }

            console.log(updatedUser);
            res.status(200).json({
                message: "Expense deleted successfully",
                status: true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error.message || "Internal Server Error",
                status: false,
            });
        }
    },

    //POST endpoint to crate user login data

    /**
  * @method savedata
  * @param {*} req - The request object containing data to be saved.
  * @param {*} res - The response object used to send the response back to the client.
  * @description This method is used to save user data into the database.
  * It expects the following parameters in the request body:
  * - username: Username of the user.
  * - name: Name of the user.
  * - firstlogindate: Date of the first login.
  * - lastlogindate: Date of the last login.
  * - expenselogged: Number of expenses logged by the user.
  * - userid: ID of the user associated with the data.
  * @returns {Object} Returns a JSON object with the following structure:
  * {
  *    message: String, // Describes the outcome of the operation.
  *    status: Boolean, // Indicates the success or failure of the operation.
  * }
  * If successful, it returns:
  * {
  *    message: 'User Data Added',
  *    status: true,
  * }
  * If there's an error during the operation, it returns an appropriate error message and sets the status to false, along with the HTTP status code:
  * - 501: Not Implemented - When there's an unexpected error or failure during the operation.
  * @example
  * // Sample request body:
  * {
  *    "username": "john_doe",
  *    "name": "John Doe",
  *    "firstlogindate": "2024-03-20",
  *    "lastlogindate": "2024-03-22",
  *    "expenselogged": 10,
  *    "userid": "1234567890"
  * }
  * @example
  * // Sample response for successful operation:
  * {
  *    "message": "User Data Added",
  *    "status": true
  * }
  * @example
  * // Sample response for unsuccessful operation:
  * {
  *    "message": "Error message",
  *    "status": false
  * }
  */


    savedata: async (req, res) => {

        // Extract data from the request body
        const { username, name, firstlogindate, lastlogindate, expenselogged, userid } = req.body;

        // Create a new instance of SaveData model
        const newData = new SaveData({
            username,
            name,
            firstlogindate,
            lastlogindate,
            userid,
            expenselogged

        });

        UserModel.updateOne({ _id: userid }, {
            $push: { userdata: newData }
        }).then((result) => {
            res.status(200).json({
                message: 'User Data Added',
                status: true,
            })
            console.log(result);
        }).catch((err) => {
            res.status(501).json({
                message: err,
                status: false,
            });
        });


    },

    /**
  * @method getsavedata
  * @param {*} req - The request object containing parameters for fetching saved user data.
  * @param {*} res - The response object used to send the response back to the client.
  * @param {*} next - The next middleware function in the Express middleware chain (optional).
  * @description This method is used to retrieve saved user data associated with a specific user ID.
  * It expects the following parameter in the request:
  * - id: ID of the user whose saved data is to be fetched (passed as a route parameter).
  * @returns {Object} Returns a JSON object with the following structure:
  * {
  *    message: String, // Describes the outcome of the operation.
  *    data: Object, // Contains the saved user data object if the operation is successful.
  *    status: Boolean, // Indicates the success or failure of the operation.
  * }
  * If successful, it returns:
  * {
  *    message: "Fetch one",
  *    data: {Saved user data object},
  *    status: true,
  * }
  * If the specified user is not found, it returns:
  * {
  *    message: "User not found",
  *    status: false,
  * }
  * If there's an error during the operation, it returns an appropriate error message and sets the status to false, along with the HTTP status code:
  * - 404: Not Found - When the specified user is not found.
  * - 500: Internal Server Error - When there's an unexpected error or failure during the operation.
  * @example
  * // Sample request URL: GET /api/savedata/user/1234567890
  * @example
  * // Sample response for successful operation:
  * {
  *    "message": "Fetch one",
  *    "data": {
  *        "username": "john_doe",
  *        "name": "John Doe",
  *        "firstlogindate": "2024-03-20",
  *        "lastlogindate": "2024-03-22",
  *        "expenselogged": 10,
  *        "userid": "1234567890",
  *        "_id": "60f21cb86f8b8e0039bd66a9",
  *        "createdAt": "2024-07-15T08:00:00.000Z",
  *        "updatedAt": "2024-07-15T08:00:00.000Z",
  *        "__v": 0
  *    },
  *    "status": true
  * }
  * @example
  * // Sample response for unsuccessful operation:
  * {
  *    "message": "User not found",
  *    "status": false
  * }
  */


    getsavedata: async (req, res, next) => {
        try {
            console.log(req.params.id);
            const user = await UserModel.findOne({ _id: req.params.id });
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    status: false,
                });
            }
            res.status(200).json({
                message: 'Fetch one',
                data: user.userdata[0],
                status: true,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: err.message || "Internal Server Error",
                status: false,
            });
        }
    },

    /**
  * @method updatesavedata
  * @param {*} req - The request object containing parameters for updating saved user data.
  * @param {*} res - The response object used to send the response back to the client.
  * @param {*} next - The next middleware function in the Express middleware chain (optional).
  * @description This method is used to update saved user data associated with a specific user ID.
  * It expects the following parameters in the request:
  * - id: ID of the user whose saved data is to be updated (passed as a route parameter).
  * @returns {Object} Returns a JSON object with the following structure:
  * {
  *    message: String, // Describes the outcome of the operation.
  *    status: Boolean, // Indicates the success or failure of the operation.
  * }
  * If successful, it returns:
  * {
  *    message: "Successfully updated login date and expense logged",
  *    status: true,
  * }
  * If the specified user data is not found, it returns:
  * {
  *    message: "User data not found",
  *    status: false,
  * }
  * If there's an error during the operation, it returns an appropriate error message and sets the status to false, along with the HTTP status code:
  * - 404: Not Found - When the specified user data is not found.
  * - 500: Internal Server Error - When there's an unexpected error or failure during the operation.
  * @example
  * // Sample request URL: PUT /api/savedata/user/1234567890
  * // Sample request body:
  * {
  *    "lastlogindate": "2024-03-22",
  *    "expenselogged": 12
  * }
  * @example
  * // Sample response for successful operation:
  * {
  *    "message": "Successfully updated login date and expense logged",
  *    "status": true
  * }
  * @example
  * // Sample response for unsuccessful operation:
  * {
  *    "message": "User data not found",
  *    "status": false
  * }
  */


    updatesavedata: async (req, res, next) => {
        try {
            const result = await UserModel.findOneAndUpdate(
                { _id: req.params.id, 'userdata.userid': req.params.id },
                {
                    $set: {
                        'userdata.$.lastlogindate': req.body.lastlogindate,
                        'userdata.$.expenselogged': req.body.expenselogged,
                    }
                },
                { new: true }
            );

            if (!result) {
                return res.status(404).json({
                    message: "User data not found",
                    status: false,
                });
            }

            res.status(200).json({
                message: "Successfully updated login date and expense logged",
                status: true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error.message || "Internal Server Error",
                status: false,
            });
        }
    },

    /**
 * @method getcategory
 * @param {*} req - The request object containing parameters for fetching categories.
 * @param {*} res - The response object used to send the response back to the client.
 * @param {*} next - The next middleware function in the Express middleware chain (optional).
 * @description This method is used to retrieve all categories associated with a specific user ID.
 * It expects the following parameter in the request:
 * - id: ID of the user whose categories are to be fetched (passed as a route parameter).
 * @returns {Object} Returns a JSON object with the following structure:
 * {
 *    message: String, // Describes the outcome of the operation.
 *    data: Array, // Contains an array of categories if the operation is successful.
 *    status: Boolean, // Indicates the success or failure of the operation.
 * }
 * If successful, it returns:
 * {
 *    message: "Fetch All Category",
 *    data: [Array of categories],
 *    status: true,
 * }
 * If the specified user is not found, it returns:
 * {
 *    message: "User not found",
 *    status: false,
 * }
 * If there's an error during the operation, it returns an appropriate error message and sets the status to false, along with the HTTP status code:
 * - 404: Not Found - When the specified user is not found.
 * - 500: Internal Server Error - When there's an unexpected error or failure during the operation.
 * @example
 * // Sample request URL: GET /api/category/user/1234567890
 * @example
 * // Sample response for successful operation:
 * {
 *    "message": "Fetch All Category",
 *    "data": [
 *        "Food",
 *        "Transportation",
 *        "Utilities",
 *        // Additional categories...
 *    ],
 *    "status": true
 * }
 * @example
 * // Sample response for unsuccessful operation:
 * {
 *    "message": "User not found",
 *    "status": false
 * }
 */

    getcategory: async (req, res, next) => {
        try {
            const user = await UserModel.findOne({ _id: req.params.id });
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    status: false,
                });
            }
            res.status(200).json({
                message: 'Fetch All Category',
                data: user.category,
                status: true,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: err.message || "Internal Server Error",
                status: false,
            });
        }
    },

    /**
 * @method savecategory
 * @param {*} req - The request object containing parameters for saving categories.
 * @param {*} res - The response object used to send the response back to the client.
 * @param {*} next - The next middleware function in the Express middleware chain (optional).
 * @description This method is used to save new categories associated with a specific user ID.
 * It expects the following parameters in the request:
 * - id: ID of the user to which the categories will be associated (passed as a route parameter).
 * - categories: An array of categories to be saved (passed in the request body).
 * @returns {Object} Returns a JSON object with the following structure:
 * {
 *    message: String, // Describes the outcome of the operation.
 *    status: Boolean, // Indicates the success or failure of the operation.
 * }
 * If successful, it returns:
 * {
 *    message: "Categories added successfully",
 *    status: true,
 * }
 * If the specified user is not found or no categories were added, it returns:
 * {
 *    message: "User not found or no categories added",
 *    status: false,
 * }
 * If there's an error during the operation, it returns an appropriate error message and sets the status to false, along with the HTTP status code:
 * - 404: Not Found - When the specified user is not found or no categories were added.
 * - 500: Internal Server Error - When there's an unexpected error or failure during the operation.
 * @example
 * // Sample request URL: POST /api/category/user/1234567890
 * // Sample request body:
 * {
 *    "categories": ["Food", "Transportation", "Utilities"]
 * }
 * @example
 * // Sample response for successful operation:
 * {
 *    "message": "Categories added successfully",
 *    "status": true
 * }
 * @example
 * // Sample response for unsuccessful operation:
 * {
 *    "message": "User not found or no categories added",
 *    "status": false
 * }
 */


    savecategory: async (req, res, next) => {
        const userId = req.params.id;
        const categories = req.body.categories;

        try {
            // Update the user document to push new categories
            const result = await UserModel.updateOne(
                { _id: userId },
                { $push: { category: { $each: categories } } }
            );

            // Check if the update was successful
            if (result.nModified === 0) {
                return res.status(404).json({
                    message: "User not found or no categories added",
                    status: false,
                });
            }

            // Respond with success message
            res.status(200).json({
                message: 'Categories added successfully',
                status: true,
            });
        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({
                message: error.message || "Internal Server Error",
                status: false,
            });
        }
    },

    /**
  * @method updateprofile
  * @param {*} req - The request object containing parameters for updating user profile.
  * @param {*} res - The response object used to send the response back to the client.
  * @param {*} next - The next middleware function in the Express middleware chain (optional).
  * @description This method is used to update user profile information associated with a specific user ID.
  * It expects the following parameters in the request:
  * - id: ID of the user whose profile information will be updated (passed as a route parameter).
  * - username: New username for the user (passed in the request body).
  * - name: New name for the user (passed in the request body).
  * @returns {Object} Returns a JSON object with the following structure:
  * {
  *    message: String, // Describes the outcome of the operation.
  *    status: Boolean, // Indicates the success or failure of the operation.
  * }
  * If successful, it returns:
  * {
  *    message: "Successfully updated profile information",
  *    status: true,
  * }
  * If the specified user profile is not found or not updated, it returns:
  * {
  *    message: "User profile not found or not updated",
  *    status: false,
  * }
  * If there's an error during the operation, it returns an appropriate error message and sets the status to false, along with the HTTP status code:
  * - 404: Not Found - When the specified user profile is not found or not updated.
  * - 500: Internal Server Error - When there's an unexpected error or failure during the operation.
  * @example
  * // Sample request URL: PUT /api/profile/user/1234567890
  * // Sample request body:
  * {
  *    "username": "new_username",
  *    "name": "New Name"
  * }
  * @example
  * // Sample response for successful operation:
  * {
  *    "message": "Successfully updated profile information",
  *    "status": true
  * }
  * @example
  * // Sample response for unsuccessful operation:
  * {
  *    "message": "User profile not found or not updated",
  *    "status": false
  * }
  */


    updateprofile: async (req, res, next) => {
        const userId = req.params.id;
        const { username, name } = req.body;

        console.log("id:-" + userId);

        try {
            // Find and update the user profile
            const updatedUser = await UserModel.findOneAndUpdate(
                { 'userdata._id': userId },
                {
                    $set: {
                        'userdata.$.username': username,
                        'userdata.$.name': name
                    }
                },
                { new: true }
            );

            // Check if user profile was successfully updated
            if (!updatedUser) {
                return res.status(404).json({
                    message: "User profile not found or not updated",
                    status: false,
                });
            }

            // Respond with success message
            res.status(200).json({
                message: "Successfully updated profile information",
                status: true,
            });
        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({
                message: error.message || "Internal Server Error",
                status: false,
            });
        }
    },

    /**
 * @method updatename
 * @param {*} req - The request object containing parameters for updating user's name and username.
 * @param {*} res - The response object used to send the response back to the client.
 * @param {*} next - The next middleware function in the Express middleware chain (optional).
 * @description This method is used to update the name and username of a user associated with a specific user ID.
 * It expects the following parameters in the request:
 * - id: ID of the user whose name and username will be updated (passed as a route parameter).
 * - name: New name for the user (passed in the request body).
 * - username: New username for the user (passed in the request body).
 * @returns {Object} Returns a JSON object with the following structure:
 * {
 *    message: String, // Describes the outcome of the operation.
 *    status: Boolean, // Indicates the success or failure of the operation.
 * }
 * If successful, it returns:
 * {
 *    message: "Successfully updated user information",
 *    status: true,
 * }
 * If the specified user is not found or not updated, it returns:
 * {
 *    message: "User not found or not updated",
 *    status: false,
 * }
 * If there's an error during the operation, it returns an appropriate error message and sets the status to false, along with the HTTP status code:
 * - 404: Not Found - When the specified user is not found or not updated.
 * - 500: Internal Server Error - When there's an unexpected error or failure during the operation.
 * @example
 * // Sample request URL: PUT /api/updatename/user/1234567890
 * // Sample request body:
 * {
 *    "name": "New Name",
 *    "username": "new_username"
 * }
 * @example
 * // Sample response for successful operation:
 * {
 *    "message": "Successfully updated user information",
 *    "status": true
 * }
 * @example
 * // Sample response for unsuccessful operation:
 * {
 *    "message": "User not found or not updated",
 *    "status": false
 * }
 */


    updatename: async (req, res, next) => {
        const userId = req.params.id;
        const { name, username } = req.body;

        try {
            // Find and update the user's name and username
            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: userId },
                { name, username },
                { new: true }
            );

            // Check if user was found and updated
            if (!updatedUser) {
                return res.status(404).json({
                    message: "User not found or not updated",
                    status: false,
                });
            }

            // Respond with success message
            res.status(200).json({
                message: "Successfully updated user information",
                status: true,
            });
        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({
                message: error.message || "Internal Server Error",
                status: false,
            });
        }
    },



}
