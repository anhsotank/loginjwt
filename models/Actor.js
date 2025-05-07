const mongoose = require("mongoose");

const ActorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  bio: { type: String },
});

module.exports = mongoose.model("Actor", ActorSchema);
