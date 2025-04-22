const mongoose = require("mongoose");

const riderUpdateSchema = new mongoose.Schema({
  name: String,
  location: String,
  timestamp: String,
  partition: Number,
});

module.exports = mongoose.model("RiderUpdate", riderUpdateSchema);
