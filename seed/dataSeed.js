"use strict";
const fs = require("fs");
require("dotenv").config({path:"./../.env"});
const {
  _dbConnect,
  _dbDisconnect,
} = require("./../mongodb/simpleDbConnection");
const Question = require("./../models/questionmodel");

const Data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
console.log(Data.length)

async function addData() {
  try {
    await _dbConnect(
      process.env.DB_URI.replace("<PASSWORD>", process.env.DB_PASSWORD)
    );
    console.log("/* ======== Database successfully connected ======== */");

    await Question.create(Data);
    console.log("/* ======== Data added to the database ======== */");
  } catch (err) {
    console.error("Error while connecting to the database", err);
    //shutdown the application
    process.exit(1);
  } finally {
    await _dbDisconnect();
    console.log("/* ======== Database successfully closed ======== */");
  }
}

addData();
