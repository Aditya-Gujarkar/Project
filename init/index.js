const mongoose = require("mongoose"); // requiring mongoose
const Listing = require("../models/listing"); // requiring the listing model
const initData=require("./data1"); // requiring the data file

const Mongo_URL = "mongodb://127.0.0.1:27017/BookE"; // connecting to mongoDB

main()          // main function is called to connect to the database
  .then(() =>{
    console.log("db connected")})
  .catch((err) => {
    console.log(err);
  });
async function main() { // async function to connect to the database
  await mongoose.connect(Mongo_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({}); // deleting all the listings from the database    
    await Listing.insertMany(initData.data); // inserting the data into the database
    console.log("data inserted");
};

initDB();  // calling the initDB function to initialize the database with data