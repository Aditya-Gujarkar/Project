const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({  // schema for the listing model
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1785840485928-5fce5ee13d8c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=>{
            return v===""? v="https://images.unsplash.com/photo-1785840485928-5fce5ee13d8c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            :v;
        }
    },
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema); // creating a model for the listing schema
module.exports=Listing;