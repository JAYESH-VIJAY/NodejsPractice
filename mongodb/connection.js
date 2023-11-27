const mongoose = require("mongoose");
const uri = process.env.DB_URI;
console.log(uri);

const connection = mongoose
  .connect(uri)
  .then(() => {
    console.log("connection is successful!!");
  })
  .catch((err) => {
    console.log("there was an error in connecting to the database!, ⚠", err);
  });

module.exports = connection;
