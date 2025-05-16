// models/MovieReaction.js
const mongoose = require("mongoose");

const MovieReactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    reaction: { type: String, enum: ["like", "dislike"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MovieReaction", MovieReactionSchema);
