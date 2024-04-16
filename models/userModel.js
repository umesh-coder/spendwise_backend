const mongoose = require("mongoose");

const uniqueValidator = require('mongoose-unique-validator');

/**
 * @const savedata
 * @type {object}
 * @property {string} username - The username associated with the saved data.
 * @property {string} name - The name associated with the saved data.
 * @property {string} firstlogindate - The date of the first login associated with the saved data.
 * @property {string} lastlogindate - The date of the last login associated with the saved data.
 * @property {string} expenselogged - The expense logged associated with the saved data.
 * @property {string} userid - The user ID associated with the saved data.
 */

const savedata = mongoose.Schema({
  username: ({ type: String }),
  name: ({ type: String }),
  firstlogindate: ({ type: String }),
  lastlogindate: ({ type: String }),
  expenselogged: ({ type: String }),
  userid: ({ type: String }),
});

/**
 * @const createexpense
 * @type {object}
 * @property {string} name - The name of the expense.
 * @property {number} amount - The amount of the expense.
 * @property {string} expense_date - The date of the expense.
 * @property {string} expense_category - The category of the expense.
 * @property {string} payment - The payment method used for the expense.
 * @property {string} comment - Any comment associated with the expense.
 * @property {ObjectId} userid - The ID of the user associated with the expense.
 */

const createexpense = mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  expense_date: { type: String, required: true },
  expense_category: { type: String, required: true },
  payment: { type: String, required: true },
  comment: { type: String, required: false },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "userschema", required: true },
});


/**
 * @const userschema
 * @type {object}
 * @property {string} name - The name of the user.
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 * @property {string} userfirstsignupdate - The date of the user's first sign-up.
 * @property {Array.<SavedData>} userdata - Array of saved data associated with the user.
 * @property {Array.<CreateExpense>} expenses - Array of expenses associated with the user.
 * @property {Array.<string>} category - Array of categories associated with the user.
 */

const userschema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, //not works as a validator so we import mongoose-unique-validator
  password: { type: String, required: true },
  userfirstsignupdate: { type: String, required: true },
  userdata: [savedata],
  expenses: [createexpense],
  category: [],
});

userschema.plugin(uniqueValidator);

module.exports = mongoose.model("userschemas", userschema);
