const authController = require("../controllers/authControllers");
const User = require("../models/User");

const router = require("express").Router();
const { verifyToken } = require("../controllers/verifyToken");
const axiox = require("axios");

//REGISTER
router.post("/register", authController.registerUser);

//fb
router.post("/facebook", authController.loginFB);

//REFRESH TOKEN
router.post("/refresh", authController.requestRefreshToken);
//LOG IN
router.post("/login", authController.loginUser);
//LOG OUT
router.post("/logout", verifyToken, authController.logOut);

module.exports = router;
