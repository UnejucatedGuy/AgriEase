const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connection successful");
  })
  .catch((e) => {
    console.log("Connection Failed");
  });
