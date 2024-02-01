const express = require("express");
const { protect } = require("./../controllers/authcontroller");
const {
  createQuestion,
  getAllQuestions,
  getQuestions,
  getAggregate,
  preFieldAlias,
} = require("./../controllers/quizcontroller");

const router = express.Router();

router.post("/", createQuestion);
// .get("/getAll", getAllQuestions);
router.get("/", preFieldAlias,getQuestions);
router.get("/aggregate", getAggregate);
module.exports = router;  
