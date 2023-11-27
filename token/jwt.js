const crypto = require("crypto");


function generateRandomToken(length) {
  return crypto.randomBytes(length).toString("hex");
}

// Generate a random JWT secret with a length of 32 characters (256 bits)
const randomToken = generateRandomToken(32);

console.log("Random JWT Secret:", randomToken);
