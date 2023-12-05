const User = require("./../models/usermodel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../error/catchAsync");
const AppError = require("./../error/appError");
  
const { promisify } = require("util"); //built in node js

const signToken = (id) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return jwt.sign({ id: id }, secret, {
    expiresIn: expiresIn,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
      message: "user created sucessfully",
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  //2. check is email and password is correct
  const user = await User.findOne({ email }).select("+password");
  const correct = await user.correctPassword(password, user.password);
  if (!user || !correct) {
    return next(new AppError("Incorrect email or password", 401));
  }
  //3. check if everything is okay, send jwt to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: "sucess",
    token,
  });
});

// protect middleware
exports.protect = catchAsync(async (req, res, next) => {
  //1. getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    return next(
      new AppError(
        "You are not logged in!, please logged in to get access.",
        401
      )
    );
  }
  //2. verification token (validating the token)
  const decoded = await promisify(jwt.verify(token, process.env.JWT_SECRET));
  console.log(decoded);
  //3. check if user is still exists

  //4. check if user changed password after the jwt was issued

  next();
});
