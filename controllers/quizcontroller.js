const AppError = require("../error/appError");
const catchAsync = require("../error/catchAsync");
const Question = require("./../models/questionmodel");

exports.preFieldAlias = (req, res, next) => {
  req.query.limit = req.query.limit || "20";
  req.query.sort = req.query.sort || "qid questions";

  // Check if the client provided a value for 'page'
  if (!req.query.page) {
    const page = Math.floor(Math.random() * 500);
    req.query.page = `${page !== 0 ? page : 1}`;
  }

  next();
};

// main Api for getting the question and all features...
exports.getQuestions = catchAsync(async (req, res, next) => {
  // destructure query string
  const { cat, sort, page, limit } = req.query;

  let queryObj = {};
  if (cat) {
    queryObj.category = cat.toLowerCase();
  }

  // switch (true) {
  //   case Boolean(cat):
  //     queryObj.category = cat;
  //     break;
  //   // handle the error case where no queryObj parameter available
  //   default:
  //     res.status(404).json({
  //       status: "fail",
  //       message: "Invalid or missing queryObj parameters.",
  //     });
  //     return; // Return here to avoid further execution
  // }
  // retrieve data from the database based on the query string
  let query = Question.find(queryObj); // Initialize the query here

  // Sorting the query only when sort is present in req.query
  if (sort) {
    query = query.sort({ [sort]: 1 }); // Assuming ascending order; adjust as needed
  }

  // pagination
  const Npage = page * 1 || 1;
  const Hlimit = limit * 1 <= 20 ? limit * 1 : 20;
  const skip = (Npage - 1) * Hlimit;

  // Apply pagination
  query = query.skip(skip).limit(Hlimit);

  // execute the query
  const data = await query;

  if (!data.length) {
    // return next(new AppError("No data found for this query...", 404));
    return res.status(404).json({
      status: "fail",
      message: "No data found for this query...",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Data successfully retrieved!",
    data,
  });
});
// ======== aggregation pipeline =========
exports.getAggregate = catchAsync(async (req, res, next) => {
  const pipeline = await Question.aggregate([
    {
      $group: {
        _id: "$options",
        totalDocument: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json({
    status: "sucess",
    pipeline,
  });
});

// update the question by qid
exports.updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findOneAndUpdate(
    { qid: req.params.qid },
    { $set: { question: req.body.question } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "data successfull updated",
    question,
  });
});

//deleteOneQuestion
exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findOneAndDelete({
    qid: req.params.qid,
  });
});

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const questions = await Question.find();
  if (!questions.length) {
    return res.status(404).json({
      status: "fail",
      message: "requested Resource is not found in Database...",
    });
  }
  res.status(200).json({
    status: "success",
    questions,
  });
});

exports.getQuestion = catchAsync(async (req, res, next) => {
  // if the value of .select is in - then that field will not show on the response, but if there is no - then only that will show in response
  const question = await Question.find({ qid: req.params.qid }).select(
    "-_id -__v -createdAt -updatedAt"
  );
  if (!question.length) {
    return res.status(404).json({
      status: "fail",
      message:
        "There were not a single question persent in the database of requested qid...",
    });
  }
  res.status(200).json({
    status: "success",
    question,
  });
});

exports.createQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.create(req.body);
  console.log(req.body);
  res.header("Content-Type", "application/json");
  res.status(201).send({
    status: "success",
    message: "question created successfully!...",
    question,
  });
});
