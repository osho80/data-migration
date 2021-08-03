const mongoose = require("mongoose");
const db = require("./db");

const siteSchema = db.createSchema({
  name: String,
  description: String,
  area: { type: mongoose.Schema.Types.ObjectId, ref: "areas" },
});

module.exports = mongoose.model("sites", siteSchema);
