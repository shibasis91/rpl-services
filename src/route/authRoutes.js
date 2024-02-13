const express = require("express");
const {
  searchUser,
  registerUser,
  verifyUser,
  loginUser,
} = require("../controller/authController");

const userRoutes = express.Router();

//Search user
userRoutes.post("/user", searchUser);

//Register user
userRoutes.post("/user/signup", registerUser);

//Verify user
userRoutes.post("/user/verify", verifyUser);

//Signin user
userRoutes.post("/user/signin", loginUser);

module.exports = userRoutes;
