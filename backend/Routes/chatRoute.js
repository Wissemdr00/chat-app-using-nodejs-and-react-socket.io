const express = require("express");


const { createChat,findChat,findUserchats} = require("../Controllers/chatController");
const router = express.Router();


// Routes
router.post("/", createChat);
router.get("/:userId", findUserchats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;