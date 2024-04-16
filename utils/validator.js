// validate.js
const { body, validationResult } = require('express-validator');


module.exports = {
    /**
       * Middleware to validate signup data.
       * @module validateSignup
       * @function
       * @param {Object} req - Express request object.
       * @param {Object} res - Express response object.
       * @param {Function} next - Express next middleware function.
       * @returns {void}
       * @description Validates the data sent during user signup. Checks if the required fields are present and meet specific criteria. 
       *    - Validates the name to ensure it is not empty, has between 3 to 15 characters, and contains alphabetic characters only.
       *    - Validates the username to ensure it is not empty, has between 5 to 15 characters, starts with an alphabet, and can contain letters and numbers.
       *    - Validates the email to ensure it is a valid email address and within the specified length range.
       *    - Validates the password to ensure it is at least 5 characters long.
       *    - Validates the user's first sign-up date to ensure it is not empty and follows the format YYYY-MM-DD.
       *    - Validates the category to ensure it is not empty and contains alphabetic characters only.
       */
    validateSignup: [
        body('name').notEmpty().withMessage('Name is required').isLength({ min: 3, max: 30 }).withMessage('Name must have more than 3 characters').matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic'),
        body('username').notEmpty().withMessage('Username is required').isLength({ min: 5, max: 30 }).withMessage('Username must have more than 5 characters and less tha 15 charcter').matches(/^[A-Za-z][A-Za-z0-9]*$/).withMessage('Username must start with an alphabet and can contain letters and numbers'),
        body('email').isEmail().matches(/^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).isLength({ min: 5, max: 255 }).withMessage('Email must be between 5 and 255 characters').withMessage('Email is not valid'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
        // body('userfirstsignupdate').notEmpty().withMessage('First sign-up date is required').isLength({ min: 10, max: 16 }).withMessage('First sign-up date must be in the format YYYY-MM-DD'),
        body('category').notEmpty().withMessage('Category is required').matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
    ],

    /**
    * Middleware to validate login data.
    * @module validateLogin
    * @function
    * @param {Object} req - Express request object.
    * @param {Object} res - Express response object.
    * @param {Function} next - Express next middleware function.
    * @returns {void}
    * @description Validates the data sent during user login. Checks if the email and password are valid.
    *   - Validates the email to ensure it is a valid email address and within the specified length range.
    *   - Validates the password to ensure it is at least 5 characters long.
    */

    validateLogin: [
        body('email').isEmail().matches(/^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).withMessage('Not a valid e-mail address').isLength({ min: 5, max: 255 }).withMessage('Email must be between 5 and 255 characters'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
        async (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },

    ],

    /**
    * Middleware to validate expense creation data.
    * @module validateCreateExpense
    * @function
    * @param {Object} req - Express request object.
    * @param {Object} res - Express response object.
    * @param {Function} next - Express next middleware function.
    * @returns {void}
    * @description Validates the data sent when creating an expense. Ensures all required fields are present and meet specific criteria.
    *    - Validates the name to ensure it is not empty, has between 3 to 15 characters, and contains alphabetic characters only.
    *    - Validates the amount to ensure it is a valid number greater than zero.
    *    - Validates the expense date to ensure it is not empty and follows the format YYYY-MM-DD.
    *    - Validates the expense category to ensure it is not empty, contains alphabetic characters only, and within the specified length range.
    *    - Validates the payment method to ensure it is not empty and within the specified length range.
    *    - Validates the comment to ensure it is within the specified length range.
    *    - Validates the user ID to ensure it is a valid MongoDB ID.
    */

    validateCreateExpense: [
        body('name')
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 3, max: 15 }).withMessage('Name must be between 3 and 15 characters').matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic'),
        body('amount')
            .notEmpty().withMessage('Amount is required')
            .isNumeric().withMessage('Amount must be a number')
            .isLength({ min: 1, max: 10 })
            .isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
        // body('expense_date')
        //     .notEmpty().withMessage('Expense date is required')
        //     .isLength({ min: 10, max: 10 }).withMessage('First sign-up date must be in the format YYYY-MM-DD'),
        body('expense_category')
            .notEmpty().withMessage('Expense category is required')
            .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic')
            .isLength({ min: 1, max: 15 }).withMessage('Expense category must be between 1 and 15 characters'),
        body('payment')
            .notEmpty().withMessage('Payment method is required')
            .isLength({ min: 1, max: 20 }).withMessage('Payment method must be between 1 and 20 characters')
            .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic'),
        body('comment')
            .optional()
            .isLength({ max: 50 }).withMessage('Comment must be less than 50 characters'),

        async (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },


    ],

    /**
     * Middleware to validate save data.
     * @module saveDataValidator
     * @function
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {void}
     * @description Validates the data sent when saving user data. Checks if all required fields are present and meet specific criteria.
     *   - Validates the username to ensure it is not empty, has between 5 to 15 characters, starts with an alphabet, and can contain letters and numbers.
     *   - Validates the name to ensure it is not empty, has between 3 to 15 characters, and contains alphabetic characters only.
     *   - Validates the first login date to ensure it is not empty and follows the format YYYY-MM-DD.
     *   - Validates the last login date to ensure it is not empty and follows the format YYYY-MM-DD.
     *   - Validates the expense logged to ensure it is a valid number.
     *   - Validates the user ID to ensure it is a valid MongoDB ObjectId.
     */
    saveDataValidator: [
        body('username').not().isEmpty().withMessage('Username is required').isLength({ min: 5, max: 30 }).withMessage('Username must have more than 5 characters and less tha 15 charcter').matches(/^[A-Za-z][A-Za-z0-9]*$/).withMessage('Username must start with an alphabet and can contain letters and numbers'),
        body('name').not().isEmpty().withMessage('Name is required').isLength({ min: 3, max: 30 }).withMessage('Name must have more than 3 characters').matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic'),
        // body('firstlogindate').notEmpty().withMessage('First login date is required').isLength({ min: 10, max: 10 }).withMessage('First login-date date must be in the format YYYY-MM-DD'),
        // body('lastlogindate').notEmpty().withMessage('last login date is required').isLength({ min: 10, max: 10 }).withMessage('last login-date date must be in the format YYYY-MM-DD'),
        body('expenselogged').isNumeric().withMessage('Expense logged must be a number').isLength({ min: 1, max: 5 }),
        body('userid').isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },


    ],

    /**
    * Middleware to validate update save data.
    * @module updateSaveDataValidator
    * @function
    * @param {Object} req - Express request object.
    * @param {Object} res - Express response object.
    * @param {Function} next - Express next middleware function.
    * @returns {void}
    * @description Validates the data sent when updating saved user data. Ensures all required fields are present and meet specific criteria.
    *   - Validates the last login date to ensure it is not empty and follows the format YYYY-MM-DD.
    *   - Validates the expense logged to ensure it is a valid number greater than zero.
    */
    updatesavedataValidator: [

        // body('lastlogindate').notEmpty().withMessage('last login date is required').isLength({ min: 10, max: 10 }).withMessage('last login-date date must be in the format YYYY-MM-DD'),
        // body('expenselogged').isNumeric().withMessage('Expense logged must be a number').isLength({ min: 1, max: 5 }).isFloat({ gt: 0 }).withMessage('Expense logged must be greater than zero'),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },

    ],

    /**
   * Middleware to validate data when saving expense categories.
   * @module saveCategoryValidator
   * @function
   * @param {Object} req - The request object containing the incoming HTTP request from the client.
   * @param {Object} res - The response object used to send HTTP responses back to the client.
   * @param {Function} next - The next middleware function to be called.
   * @returns {void}
   * @description Validates the data sent when saving expense categories. Ensures the categories field is an array and each category is a string containing alphabetic characters only.
   */

    saveCategoryValidator: [
        // Validate that categories is an array
        // body('categories').isArray().withMessage('Categories must be an array'),

        // Validate each element in the categories array as a string
        // body('categories.*').isString().withMessage('Each category must be a string').matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic'),

        async (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },

    ],

    /**
    * Middleware to validate update profile data.
    * @module updateProfileValidator
    * @function
    * @param {Object} req - Express request object.
    * @param {Object} res - Express response object.
    * @param {Function} next - Express next middleware function.
    * @returns {void}
    * @description Validates the data sent when updating user profile. Ensures all required fields are present and meet specific criteria.
    *   - Validates the username to ensure it is not empty, has between 5 to 15 characters, starts with an alphabet, and can contain letters and numbers.
    *   - Validates the name to ensure it is not empty, has between 3 to 15 characters, and contains alphabetic characters only.
    */
    updateProfileValidator: [
        // Validate username
        body('username').notEmpty().withMessage('Username is required').isLength({ min: 5, max: 30 }).withMessage('Username must have more than 5 characters and less tha 15 charcter').matches(/^[A-Za-z][A-Za-z0-9]*$/).withMessage('Username must start with an alphabet and can contain letters and numbers'),

        // Validate name
        body('name').notEmpty().withMessage('Name is required').isLength({ min: 3, max: 30 }).withMessage('Name must have more than 3 characters').matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic'),

        async (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },


    ],
}