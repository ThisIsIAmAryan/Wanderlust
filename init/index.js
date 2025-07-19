const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

if(process.env.NODE_ENV != "production") {
  require('dotenv').config({ path: '../.env' });
}

const MONGO_URL = process.env.ATLAS_DB_URL;

if (!MONGO_URL) {
  console.error("ATLAS_DB_URL not found in environment variables");
  process.exit(1);
}

console.log("Connecting to MongoDB Atlas...");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Deleted existing data");
    
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "687b4325e67a5ef9e782a099",
    }));
    
    await Listing.insertMany(initData.data);
    console.log("Data was initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

initDB();
