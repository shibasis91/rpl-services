const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const { generateJSONResponse, generateAuthToken } = require("../utils/utils");

const searchUser = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (user) {
      return generateJSONResponse(res, 200, "User found", phone);
    }
    return generateJSONResponse(res, 404, "User not found");
  } catch (error) {
    console.log("Error: ", error.message);
    return generateJSONResponse(res, 500, error.message);
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, phone, password, avatar } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      const otp = await otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      //Todo: Send otp to number
      console.log("OTP", otp);
      const newUser = new User({ name, phone, password, otp, avatar });
      const user = await newUser.save();
      return generateJSONResponse(res, 200, "User added", user);
    } else {
      return generateJSONResponse(
        res,
        200,
        "This number is already in use",
        null
      );
    }
  } catch (error) {
    console.log("Error: ", error.message);
    return generateJSONResponse(res, 500, error.message);
  }
};

const verifyUser = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return generateJSONResponse(res, 404, "User not found");
    }
    if (!(await bcrypt.compare(otp, user.otp))) {
      return generateJSONResponse(res, 400, "Invalid OTP", null);
    }
    user.isVerified = true;
    await user.save();
    const secret = process.env.JWT_SECRET_KEY;
    const payload = {
      user: {
        id: user._id,
      },
    };
    const token = generateAuthToken(jwt, payload, secret);
    return generateJSONResponse(res, 200, "Signin successful", {
      user,
      token,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    return generateJSONResponse(res, 500, error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return generateJSONResponse(res, 404, "User not found");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return generateJSONResponse(res, 400, "Invalid Password", null);
    }
    const secret = process.env.JWT_SECRET_KEY;
    const payload = {
      user: {
        id: user._id,
      },
    };
    const token = generateAuthToken(jwt, payload, secret);
    return generateJSONResponse(res, 200, "Signin successful", {
      user,
      token,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    return generateJSONResponse(res, 500, error.message);
  }
};

module.exports = { searchUser, registerUser, verifyUser, loginUser };
