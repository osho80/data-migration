const mongoose = require("mongoose");
const db = require("./db");

const singleSchema = db.createSchema({
  name: { type: String, default: "" },
  latitude: { type: String, default: "" },
  longitude: { type: String, default: "" },
  formatted_address: { type: String, default: "" },
  trackUrl: { type: String, default: "" },
  description: { type: String, default: "" },
  difficulty: { type: String, default: "" },
  directions: { type: String, default: "" },
  gallery: { type: Array, default: [] },
  imageUrl: { type: String, default: "" },
  physical_difficulty: { type: String, default: "" },
  shape: { type: String, default: "" },
  time: { type: String, default: "" },
  type: { type: String, default: "" },
  site: { type: mongoose.Schema.Types.ObjectId, ref: "sites" },
});

module.exports = mongoose.model("singles", singleSchema);
