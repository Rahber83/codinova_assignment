const mongoose = require("mongoose");

const exchangeIcon = new mongoose.Schema({
  exchange_id: { type: String },
  url: { type: String },
});

module.exports = mongoose.model("exchangeIcon", exchangeIcon);
