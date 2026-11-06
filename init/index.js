const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to DB wanderlust.");
  })
  .catch((err) => {
    console.log(`Error while connecting Database wanderlust - ${err}`);
  });

async function initDB() {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6aecfc831dbc04da39ee6e9f",
  }));
  await Listing.insertMany(initData.data);
}

initDB();
