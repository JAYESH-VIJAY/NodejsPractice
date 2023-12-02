const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const mongoose = require("mongoose");
const { _dbConnect } = require("./mongodb/simpleDbConnection");

//============= Handling unCaught Exception ============
process.on("uncaughtException", (err) => {
  console.log("unCaughtException! 👽, Shutting Down!...");
  console.log(err.name, ":", err.message);
  // Code 0 for success and 1 for failure
  process.exit(1);
});

//=========== Database connection ==========
const port = process.env.PORT || 5000;

const uri = process.env.DB_URI.replace("<PASSWORD>", process.env.DB_PASSWORD);

async function startServer() {
  try {
    const db = await _dbConnect(uri);
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    //================= Listening to server =============

    // Handling unHandledRejection error
    process.on("unhandledRejection", (err) => {
      console.log("UnhandledRejection! 👽, Shutting Down!...");
      console.log(err.name, ":", err.message);
      server.close(() => {
        // Code 0 for success and 1 for failure
        process.exit(1);
      });
    });
  } catch (error) {
    console.log("Error in connecting to the database!..", error);
    //========= Handle this error, exit the application (0 for success and 1 for failure)
    process.exit(1);
  }
}

// Call startServer to initiate the server setup
startServer();
