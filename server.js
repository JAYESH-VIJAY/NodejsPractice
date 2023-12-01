const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const mongoose = require("mongoose");

//============= handling unCaught Exception ============ (like a variable is not defined etc...)
process.on("uncaughtException", (err) => {
  console.log("unCaughtException! 👽, Shutting Down!...");
  console.log(err.name,":", err.message);
    // code 0 for success and 1 for failed
    process.exit(1);
});

//=========== Database connection ==========
const port = process.env.PORT || 5000;

const uri = process.env.DB_URI.replace("<PASSWORD>", process.env.DB_PASSWORD);
console.log(uri);

const connection = mongoose
  .connect(uri)
  .then(() => {
    console.log("connection is successful!!");
  })
  .catch((err) => {
    console.log("there was an error in connecting to the database!, ⚠", err);
  });

//================= listening to server =============

const server = app.listen(port, () => {
  console.log(`server is running on the ${port} port `);
});

//================ handling unHandledRejection error ==============

process.on("unhandledRejection", (err) => {
  console.log("UnhandledRejection! 👽, Shutting Down!...");
  console.log(err.name,":", err.message);
  server.close(() => {
    // code 0 for success and 1 for failed
    process.exit(1);
  });
});



