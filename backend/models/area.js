const mongoose = require("mongoose");
const db = require("./db");

const areaSchema = db.createSchema({
  name: String,
});

module.exports = mongoose.model("areas", areaSchema);
