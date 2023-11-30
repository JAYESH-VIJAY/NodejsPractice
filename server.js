const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
require("./mongodb/connection");

const port = process.env.PORT || 5000;

//================= listening to server =============

app.listen(port, () => {
  console.log(`server is running on the ${port} port `);
});
