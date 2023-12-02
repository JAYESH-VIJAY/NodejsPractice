const mongoose = require("mongoose");

async function _dbConnect(DB_URI) {
  try {
    await mongoose.connect(DB_URI, {
      bufferCommands: false,// for this line see commented text for full explanation
    });
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Failed", error.message);
    throw error; // Propagate the error to the caller if needed
  }
}

async function _dbDisconnect() {
  try {
    await mongoose.connection.close();
    console.log("DB Disconnected");
  } catch (error) {
    console.error("DB Disconnection Failed", error.message);
    throw error; // Propagate the error to the caller if needed
  }
}

module.exports = { _dbConnect, _dbDisconnect };


// Command Buffering in Mongoose:
// Command Buffering Enabled (Default):

// When bufferCommands is set to true (which is the default behavior if not explicitly set), Mongoose buffers all the commands (like inserts, updates, and deletes) until a successful connection to the MongoDB server is established.

// This means that if your application tries to perform database operations before the connection to the MongoDB server is established, those operations are queued and executed once the connection is available.

// Command Buffering Disabled (bufferCommands: false):

// When bufferCommands is set to false, Mongoose does not buffer commands. If there is no established connection to the MongoDB server, attempting to execute a command will result in an error.
// Why Disable Command Buffering:
// Immediate Error Handling:

// With bufferCommands: false, if your application attempts a database operation before the connection is established, it will immediately receive an error. This allows for more explicit error handling in your code.
// Fine-grained Control:

// Disabling command buffering gives you more fine-grained control over when and how commands are executed. You can decide to wait until the connection is established before executing specific commands.