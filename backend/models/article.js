const mongoose = require("mongoose");
const db = require("./db");

const articleSchema = db.createSchema({
  author: { type: String, default: "" },
  title: { type: String, default: "" },
  content: { type: String, default: "" },
});

module.exports = mongoose.model("articles", articleSchema);
