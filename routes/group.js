//external dependencies
const express = require("express");
const router = express.Router();

//importing schema
const group_controller = require('../controller/group')

//importing middleware
const { ensureauth } = require("../middleware/middleware")

// To create a group
router.post("/creategroup",ensureauth, group_controller.createGroup)
// To add members to the group
router.put("/addmembers",ensureauth,group_controller.addMemberToGroup)
// To get a group by ID
router.get("/groupbyid",ensureauth,group_controller.getGroupById)
// To get all groups for the user
router.get("/getallgroups",ensureauth,group_controller.getallGroupsByUserId)
// Edit group name
router.put("/editgroupname",ensureauth,group_controller.editGroupName)
// Delete group
router.delete("/deletegroup",ensureauth,group_controller.deleteGroup)
// Remove members from the group
router.put("/removemembers",ensureauth,group_controller.removeMembers)

module.exports = router