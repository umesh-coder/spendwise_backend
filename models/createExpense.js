const mongoose = require("mongoose");

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

module.exports = mongoose.model("createexpenses", createexpense); 
