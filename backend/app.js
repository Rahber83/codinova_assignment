const express = require("express");
const dotenv = require("dotenv");
const connectToMongoDB = require("./DBconfig/dbConfig");
const routes = require("./routes/routes");
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});
