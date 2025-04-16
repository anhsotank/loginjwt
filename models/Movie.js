const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    moviename: {
      type: String,
      required: true,
      min: 2,
      max: 20,
      unique: false,
    },
    srcVideo: {
      type: String,
      max: 200,
      unique: false,
    },
    image: {
      type: String,
      unique: false,
    },

    description: {
      type: String,
      max: 200,
      default: "No description available",
      unique: false,
    },
    releaseYear: {
      type: String,
      min: 6,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
