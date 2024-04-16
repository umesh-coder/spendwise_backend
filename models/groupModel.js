const mongoose = require("mongoose");
const userschemas = require("./userModel");

const uniqueValidator = require("mongoose-unique-validator");

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
 * @property {Array<object>} split_members - The members to be included in the split.
 */

const createexpense = mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  expense_date: { type: String, required: true },
  expense_category: [{ type: String }],
  payment: { type: String, required: true },
  comment: { type: String, required: false },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userschemas",
    required: true,
  },
  split_members: [
    {
      member_id: {
        type :String
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "groupschema",
        // required: true,
      },
      shareamount: { type: Number },
      status: { type: String },
    },
  ],
});

/**
 * @const groupschema
 * @type {object}
 * @property {string} name - The name of the user.
 * @property {string} groupcreatedat - The date of the group creation.
 * @property {Array.<CreateExpense>} expenses - Array of expenses associated with the user.
 * @property {Array.<string>} category - Array of categories associated with the user.
 */

const groupschema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: String }],
  groupcreatedat: { type: Date, default: Date.now }, // Use default value to set current date
  groupcreatedby: { type: mongoose.Schema.Types.ObjectId, ref: "userschemas" },
  expenses: [createexpense],
});

groupschema.plugin(uniqueValidator);

module.exports = mongoose.model("groupschema", groupschema);
