const express = require("express");


const { registerUser, loginUser, findUser, getUsers } = require("../Controllers/userController");
const router = express.Router();


// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);


module.exports = router;