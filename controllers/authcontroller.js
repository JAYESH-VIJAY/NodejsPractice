const User = require("./../models/usermodel");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const newUser = await User.create(req.body);
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const token = jwt.sign({ id: newUser._id }, secret, {
    expiresIn: expiresIn,
  });
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
      message: "user created sucessfully",
    },
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //1. check if email and password exists
  if (!email || !password) {
    res.status(404).send()
  }
  //2. check is email and password is correct

  //3. check if everything is okay, send jwt to the client
};
