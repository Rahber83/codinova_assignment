const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URI);

const connectToMongoDB = mongoose.connection;

connectToMongoDB.on(
  "error",
  console.log.bind(console, "Error in connecting to Database")
);

connectToMongoDB.once("open", function () {
  console.log("Successfully connected to Database :: MongoDB");
});

module.exports = connectToMongoDB;
