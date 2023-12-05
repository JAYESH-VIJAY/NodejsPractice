const { Schema, model } = require("mongoose");

const questionSchema = new Schema(
  {
    question: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    options: {
      type: [String, String, String, String],
      required: true,
      validate: [
        {
          validator: function (options) {
            // Check if there are exactly 4 options
            return options.length === 4;
          },
          message: "Options array must contain exactly 4 elements",
        },
        {
          validator: function (options) {
            // Check if every option is unique
            return new Set(options).size === options.length;
          },
          message: "Options must be unique",
        },
      ],
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
    qid: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: "throw", // or set it to true if you want to silently ignore additional properties (means if i send another data in request then that will not save in database if strict is true but if it is set to the throw then we will get an error if user send the other data in body which is not specified in Schema..)
    //  toJSON: {
    //   virtuals: true,
    //   transform: (doc, ret) => {
    //     ret.id = ret._id; // Remap the "_id" field to "id"
    //     delete ret._id; // Exclude the "_id" field
    //     delete ret.qid; // Exclude the "qid" field
    //     delete ret.__v; // Exclude the "__v" field
    //   },
    // },
    // toObject: {
    //   virtuals: true,
    //   transform: (doc, ret) => {
    //     ret.id = ret._id; // Remap the "_id" field to "id"
    //     delete ret._id; // Exclude the "_id" field
    //     delete ret.qid; // Exclude the "qid" field
    //     delete ret.__v; // Exclude the "__v" field
    //   },
    // },
    versionKey: false, // Exclude the "__v" field
    id: false, // Exclude the "_id" field
  }
);

const Question = model("Question", questionSchema); // here in the model "Question" is the name of the model

module.exports = Question;
