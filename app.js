const express = require("express");
const app = express(); // requiring express
const mongoose = require("mongoose"); // requiring mongoose
const Listing = require("./models/listing"); // requiring the listing model
const path = require("path"); // requiring path module
const methodOverride = require("method-override"); // requiring method-override
const ejsMate = require("ejs-mate"); // requiring ejs-mate
const wrapAsync = require("./utils/wrapAsync.js"); // requiring wrapAsync function
const ExpressError = require("./utils/ExpressError.js"); // requiring ExpressError class
const { listingSchema } = require("./schema.js"); // requiring the listing schema

app.set("view engine", "ejs"); // setting the view engine to ejs
app.set("views", path.join(__dirname, "views")); // setting the views directory
app.use(express.urlencoded({ extended: true })); // middleware to parse the request body
app.use(methodOverride("_method")); // using method-override to override the method
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "public"))); // serving static files from the public directory

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

// validations for schema using JOI and Mw
const validateListing = (req,res,next)=>{
  let {error}= listingSchema.validate(req.body); //USING JOI ,  validating the request body against the listing schema
if(error) {
  let errMsg= error.details.map(el=>el.message).join(","); // to combine all error messages
  throw new ExpressError(400,errMsg); // if there is an error, throw an ExpressError with the error message
   }else{
    next();
   }
}

// 1. Index Route: for all listings
app.get("/listings",wrapAsync( async (req, res) => {
  // route to get all the listings from the database
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// 2.a) New Route: to open form to create a new listing
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
});

// 1.a) Show Route: for a single listing
app.get("/listings/:id",wrapAsync( async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

// 2.b) Create Route: to create a new listing
app.post("/listings",validateListing,wrapAsync( async (req, res) => { // passing validatelisting and wrapAsync as MW so they will be executed before the callback function
    // let listing=req.body.listing; 
  // console.log(listing);

  // if(!req.body.listing) {
  //   throw new ExpressError(400,"Send valid data for listing");
  // }

//  let result= listingSchema.validate(req.body); //USING JOI ,  validating the request body against the listing schema 
//  if(result.error) {
//   throw new ExpressError(400,result.error.message); // if there is an error, throw an ExpressError with the error message
//  }



  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// 3. a) Edit Route: to open form to edit a listing
app.get("/listings/:id/edit",wrapAsync( async (req,res)=>{
    let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
}));

// 3.b) Update Route: to update a listing
app.put("/listings/:id",validateListing,wrapAsync( async (req,res)=>{
  // if(!req.body.listing) {
  //   throw new ExpressError(400,"Send valid data for listing");
  // }            // not needed as we using validatelisting
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// 4. Delete Route: to delete a listing
app.delete("/listings/:id",wrapAsync( async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all("/{*any}",(req,res,next)=>{       // if no route is matched then this will be executed
  next(new ExpressError(404,"Page Not Found"));
  // res.status(statusCode).send(message);
});

// CUSTOM ERROR HANDLING
app.use((err, req, res, next) => {
  let{statusCode=500,message="Something went wrong"}=err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error.ejs",{message});
} )

const port = 8080;
app.listen(port, () => {
  console.log("port is running");
});
