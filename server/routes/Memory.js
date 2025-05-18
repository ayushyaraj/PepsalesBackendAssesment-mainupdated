//import router instance

const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");

const {
  createMemory,
  getUserMemories,
  deleteMemory,
} = require("../controllers/memory");

//import all middleware
//auth isStudent isInstr isAdmin

router.post("/create", auth, createMemory);
router.get("/", auth, getUserMemories);
router.delete("/:id", auth, deleteMemory);
module.exports = router;
