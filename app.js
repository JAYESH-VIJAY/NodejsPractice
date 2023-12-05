const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoute = require("./routes/authRoute");
const quizRoute = require("./routes/quizRoute");

const AppError = require("./error/appError");
const globalErrorHandler = require("./controllers/errorcontroller");

// == ending imports ==
const app = express(); 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// =========== global ============
app.get("/", (req, res, next) => {
  res.send("Hello world!");
});

//========== route connected ========

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/questions", quizRoute);

// always use this in the last of the app.js
app.all("*", (req, res, next) => {
  // 01. first way
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.url} on this server!`,
  // });

  // 02. second way
  // const err = new Error(`Can't find the ${req.originalUrl} on this server!`);
  // err.status = "fail";
  // err.statusCode = 404;
  // next(err);

  // 03. third way
  next(new AppError(`Can't find the ${req.originalUrl} on this server!`, 404));
});

// this is error handling middleware
app.use(globalErrorHandler);

//exporting the app
module.exports = app;
