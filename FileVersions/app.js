const http = require("http");
// dotenv is used for access the environmental variable
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const port = process.env.PORT;

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === "/") {
    res.write("<p> this is the home page of my server</p>");
    return res.end();
  }
  // res.setHeader for setting the metadata of the response
  res.setHeader("Content-Type", "text/html");
  // res.write is used for sending the response
  res.write(
    "<html> this is the html code and i want to do something from this html.</html>"
  );
  // we can't send any response after res.end() or when we end this code execution or process
  res.end();
});

server.listen(port, () => {
  console.log(`server is running on the ${port} port`);
});
