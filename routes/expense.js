//external dependencies
const express = require("express");
const routes = express.Router();

//internal dependencies
// const { signup, login, deleteaccount } = require("../controller/user")
const { createexpense, getallexpenses, getsingleexpense, updateexpense } = require("../controller/expense")
const { deleteexpense, savedata, getsavedata, updatesavedata, getcategory, savecategory } = require("../controller/expense")
const { updateprofile, updatename } = require("../controller/expense")
const { ensureauth } = require("../middleware/middleware")
const { validateCreateExpense, saveDataValidator, updatesavedataValidator } = require("../utils/validator")
const { saveCategoryValidator, updateProfileValidator } = require("../utils/validator")

//create expense
routes.post("/createexpense", validateCreateExpense, ensureauth, createexpense)

//get all expenses
routes.get("/getallexpense/:id", ensureauth, getallexpenses)

//get single expense
routes.get("/getsingleexpense/:userId/:id", ensureauth, getsingleexpense)

//update expense
routes.patch("/updateexpense/:userId/:id", validateCreateExpense, ensureauth, updateexpense)

//delete expense
routes.delete("/deleteexepense/:userId/:id", ensureauth, deleteexpense)

//sava data
routes.post("/savedata", saveDataValidator, savedata)

//get save data
routes.get("/getsavedata/:id", getsavedata)

//update save data
routes.post("/updatesavedata/:id", updatesavedataValidator, updatesavedata)

//get category
routes.get("/getcategory/:id", getcategory)

//save category
routes.post('/savecategory/:id', saveCategoryValidator, savecategory);

//update profile
routes.post('/updateuserdataprofile/:id', updateProfileValidator, updateprofile)

//update name
routes.post('/updatename/:id', updateProfileValidator, updatename)

//exporting Route
module.exports = routes;
