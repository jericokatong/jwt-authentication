const express = require("express");
const { getUser, register, Login, Logout } = require("../controllers/UserController.js");
const VerifyToken = require("../middleware/VerifyToken.js");
const RefreshToken = require("../controllers/RefreshToken.js");

const router = express.Router();

router.get("/users", VerifyToken, getUser);
router.post("/register", register);
router.post("/login", Login);
router.get("/token", RefreshToken);
router.delete("/logout", Logout);

module.exports = router;
