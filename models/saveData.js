const mongoose = require('mongoose');

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
    expenselogged: ({ type: Number }),
    userid: ({ type: String }),
});

module.exports = mongoose.model('savedatas', savedata);