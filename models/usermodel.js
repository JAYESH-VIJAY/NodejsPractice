const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please tell us your name!"],
      trim: true,
      maxlength: [40, "Name can't be greater then 40 characters"],
      minlength: [3, "please enter more then 3 characters"],
    },
    slug: String,
    email: {
      type: String,
      required: [true, "please tell us your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      minlength: 8,
    },
    photo: String,
    confirmPassword: {
      type: String,
      required: [true, "please enter confirm password"],
      validate: {
        //this will only work on  Create and Save
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!!",
      },
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

//hashing and encryption password
UserSchema.pre("save", async function (next) {
  //if the password is not modified then just call the next() function
  if (!this.isModified("password")) return next();

  // Hash the password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
