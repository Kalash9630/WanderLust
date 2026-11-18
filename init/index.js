require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dburl);
}

main()
  .then(async () => {
    console.log("Connected to DB wanderlust.");
    await initDB();
  })
  .catch((err) => {
    console.log(`Error while connecting Database wanderlust - ${err}`);
  });

async function initDB() {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    // for local mongoDb
    // owner: "6afb804da0181e1a4ab71e73",

    // for atlas mongoDb
    owner: "6afe0922289b144acb10fc6a",
  }));
  await Listing.insertMany(initData.data);
}
