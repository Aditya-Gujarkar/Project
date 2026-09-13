const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Mongo_URL = "mongodb://127.0.0.1:27017/BookE";
main()
  .then(() =>{
    console.log("db connected")})
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(Mongo_URL);
}
app.get("/", (req, res) => {
  res.send("I am root");
});

const port = 8080;
app.listen(port, () => {
  console.log("port is running");
});
