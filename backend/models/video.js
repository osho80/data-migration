const mongoose = require("mongoose");
const db = require("./db");

const videoSchema = db.createSchema({
  title: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  htmlTag: { type: String, default: "" },
});

module.exports = mongoose.model("videos", videoSchema);
