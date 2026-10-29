const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = Schema({
    title : {
        type : String,
        // required : true,
    },

    description : {
        type : String,
        // required : true,
    },

    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    },

    price : {
        type : Number,
        // required : true,
    },

    location : {
        type : String,
        // required : true,
    }, 

    country : {
        type : String,
        // required : true,
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;