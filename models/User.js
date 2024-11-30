const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 6,
      max: 20,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: false,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    FBid: {
      type: String,
      default: "false1",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
