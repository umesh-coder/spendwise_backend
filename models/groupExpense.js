const mongoose = require('mongoose')

const createGroup = mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userschema",
    required: true,
  },
  groupName: { type: String, required: true },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userschema",
      required: true,
    },
  ],

  expense_date: { type: String, required: true },
  expense_category: { type: String, required: true },
  payment: { type: String, required: true },
  comment: { type: String, required: false },
});
