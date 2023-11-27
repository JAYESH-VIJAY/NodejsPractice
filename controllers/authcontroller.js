const User = require("./../models/usermodel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../error/catchAsync");
const AppError = require("./../error/appError");

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
