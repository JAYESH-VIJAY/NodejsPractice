const {Schema,model} = require("mongoose");

const questionSchema = new Schema({
  question: {
    type: String,
    trim: true,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  answer: {
    type: String,
    trim: true,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
});

const Programming = model("Programming", questionSchema);

module.exports = Programming;
