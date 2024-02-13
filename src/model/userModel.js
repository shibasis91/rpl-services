const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, require: true },
  phone: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[0-9]{10,}$/.test(value);
      },
      message: "Invalid phone number",
    },
  },
  password: {
    type: String,
    require: true,
  },
  otp: String,
  avatar: String,
  isVerified: { type: Boolean, default: false },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const newPassword = await bcrypt.hash(this.password, 10);
      this.password = newPassword;
    }
    if (this.isModified("otp")) {
      const newOtp = await bcrypt.hash(this.otp, 10);
      this.otp = newOtp;
    }
    if (this.isVerified && this.otp) {
      this.otp = undefined;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
