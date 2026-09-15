const express = require("express");
const app = express(); // requiring express
const mongoose = require("mongoose"); // requiring mongoose
const Listing = require("./models/listing"); // requiring the listing model
const path = require("path"); // requiring path module
app.set("view engine", "ejs"); // setting the view engine to ejs
app.set("views", path.join(__dirname, "views")); // setting the views directory
app.use(express.urlencoded({ extended: true })); // middleware to parse the request body
const methodOverride = require("method-override"); // requiring method-override
app.use(methodOverride("_method")); // using method-override to override the method

const Mongo_URL = "mongodb://127.0.0.1:27017/BookE"; // connecting to mongoDB

main() // main function is called to connect to the database
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  // async function to connect to the database
  await mongoose.connect(Mongo_URL);
}

app.get("/", (req, res) => {
  res.send("I am root");
});

// app.get("/tasting", async (req, res) => { // route to get all the listings from the database
//   const sampleListings = new Listing({
//     title: "My new villa",
//     description: " by the beach",
//     price: 10000,
//     location: "Goa",
//     country: "India",
//   });
//   await sampleListings.save();
//   console.log(" sample was saved");
//   res.send("successfully tested");
// })

// 1. Index Route: for all listings
app.get("/listings", async (req, res) => {
  // route to get all the listings from the database
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// 2.a) New Route: to open form to create a new listing
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
});

// 1.a) Show Route: for a single listing
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// 2.b) Create Route: to create a new listing
app.post("/listings",async (req, res) => {
  // let listing=req.body.listing;
  // console.log(listing);
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// 3. a) Edit Route: to open form to edit a listing
app.get("/listings/:id/edit",async (req,res)=>{
    let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
});

// 3.b) Update Route: to update a listing
app.put("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

// 4. Delete Route: to delete a listing
app.delete("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

const port = 8080;
app.listen(port, () => {
  console.log("port is running");
});
