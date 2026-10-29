const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

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
    })


const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.send("Hi, I am root");
})

// Index route
app.get("/listings", wrapAsync (async (req,res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));

// NEW Route (to show new form)
app.get("/listings/new", (req,res) => {
    res.render("./listings/new.ejs");
})

// Create Route (for adding in backend)
app.post("/listings", validateListing, wrapAsync( async (req,res) => {
    let {title, description, image, price, location, country} = req.body;
    let newListing = new Listing({
        title : title,
        description : description,
        image : image || undefined,
        price : price,
        location : location,
        country : country,
    });
    await newListing.save();
    // console.log("Image URL:", newListing.image); for testing the image was received or not
    res.redirect("/listings");
}));

// Read : Show route
app.get("/listings/:id", wrapAsync( async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
}));

// Edit Route (to edit the listing)
app.get("/listings/:id/edit", wrapAsync (async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

// Update Route (for saving the edited part in database)
app.put("/listings/:id", validateListing, wrapAsync (async (req,res) => {
    let {id} = req.params;
    let {title, description, image, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {
        title : title,
        description : description,
        image : image,
        price : price,
        location : location,
        country : country,
    });
    res.redirect(`/listings/${id}`);
}));

// Delete Route (for deleting a listing)
app.delete("/listings/:id", wrapAsync (async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// handling if any other page is requested other than the one that are created
app.all("/{*splat}", (req,res,next) => {
    next(new ExpressError(404, "Page Not Found!"));
})


// Error-handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{err});
});

// Checking the server is started
const port = 8080;
app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}.`);
})