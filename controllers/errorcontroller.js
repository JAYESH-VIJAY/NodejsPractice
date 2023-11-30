const AppError = require("../error/appError");

// ========= Error functions for global error controller ==========
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  //key, duplicate field value
  const key = Object.keys(err.keyPattern)[0];
  const message = `Duplicate Field Value, {"${key}: ${err.keyValue[key]}"}, please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  
}
// ========== devlopment and production error message (operational and programming) =========

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // if error is operational and trusted then send to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // if error is programming or unknown and developer don't want to reveal it to the client
  else {
    // 1. Log that error to the console.
    console.error("error ☠️", err);
    //2. send an alter message to the client
    res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    sendErrorProd(error, res);
  }
};
