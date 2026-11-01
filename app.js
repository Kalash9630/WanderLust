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
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

// Session configuration
app.use(session({
    secret: "wanderlustsecret",
    resave: false,
    saveUninitialized: true
}));

// Flash messages
app.use(flash());

// Making success messages available to EJS
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    next();
});

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

// validating listing schema
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const validateReview = (req,res, next) => {
    let {error} = reviewSchema.validate(req.body);
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
    req.flash("success", "New listing added successfully!");
    // console.log("Image URL:", newListing.image); for testing the image was received or not
    res.redirect("/listings");
}));

// Read : Show route
app.get("/listings/:id", wrapAsync( async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
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
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));

// Delete Route (for deleting a listing)
app.delete("/listings/:id", wrapAsync (async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

// adding review in database
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    let {rating, comment} = req.body;

    let newReview = new Review({
        rating : rating,
        comment : comment,
    });

    await newReview.save();

    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${id}`);
}));

// deleting the review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res) => {
    let reviewId = req.params.reviewId;
    let id = req.params.id;

    // deleting from reivews collection
    let deleteReview = await Review.findByIdAndDelete(reviewId);
    console.log(deleteReview);

    // deleting from listing collection
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}));

// handling if any other page is requested other than the one that are created
app.all("/{*splat}", (req,res,next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


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