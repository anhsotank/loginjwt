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
      required: function () {
        return this.FBid === null; // Password chỉ bắt buộc nếu không dùng Facebook
      },
      max: 50,
      unique: false,
    },
    password: {
      type: String,
      required: function () {
        return this.FBid === null; // Password chỉ bắt buộc nếu không dùng Facebook
      },
      min: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    FBid: {
      type: String,
      default: null,
    },
    image: { type: String },
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }], // Danh sách phim yêu thích
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
