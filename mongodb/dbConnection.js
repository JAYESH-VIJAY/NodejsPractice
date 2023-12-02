// Import the mongoose library
import mongoose from "mongoose";

// Get the MongoDB URI from environment variables
const DB_URI = process.env.MONGO_URI;

// Throw an error if the MongoDB URI is not defined
if (!DB_URI) {
  throw new Error(
    "Please define the MONGODB URI (MONGO_URI) environment variable inside .env.local"
  );
}

// Initialize a 'cached' object to store the MongoDB connection and promise,
let cached = global.mongoose;

// If 'cached' is not defined, create a new object and assign it to both 'cached' and 'global.mongoose'
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Define the 'dbConnect' function
async function dbConnect() {
  //here cached will tell you if there is already a connection to the database or not
  // If a connection is already cached, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no promise is present, initiate a connection and store the resulting promise
  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = await mongoose.connect(DB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for the promise to resolve, set 'cached.conn', and return the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

// Export the 'dbConnect' function
export default dbConnect;
