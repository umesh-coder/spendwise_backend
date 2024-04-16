const express = require("express");
const router = express.Router();
const groupExpense = require("../controller/groupExpense");
const { ensureauth } = require("../middleware/middleware")

router.put("/createExpense", ensureauth, groupExpense.createExpense)
router.get("/getExpenses", ensureauth, groupExpense.getExpenses)
router.get("/memberExpense", ensureauth, groupExpense.memberExpense)
router.put("/updateStatus", ensureauth, groupExpense.updateStatus)
router.get("/convert", ensureauth, groupExpense.convert)
router.get("/getid", ensureauth, groupExpense.getObjectIdByEmail)
router.get("/getemail/:id", ensureauth, groupExpense.getEmailById)
router.delete("/deletegoup/:id",ensureauth,groupExpense.deleteGroupById)


module.exports = router
