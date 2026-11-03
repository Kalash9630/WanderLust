const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

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

// Index route
router.get("/", wrapAsync (async (req,res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));

// NEW Route (to show new form)
router.get("/new", isLoggedIn, (req,res) => {
    res.render("./listings/new.ejs");
})

// Create Route (for adding in backend)
router.post("/", isLoggedIn, validateListing, wrapAsync( async (req,res) => {
    let {title, description, image, price, location, country} = req.body;
    let newListing = new Listing({
        title : title,
        description : description,
        image : image || undefined,
        price : price,
        location : location,
        country : country,
    });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing added successfully!");
    // console.log("Image URL:", newListing.image); for testing the image was received or not
    res.redirect("/listings");
}));

// Read : Show route
router.get("/:id", wrapAsync( async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
            model: "User"
        }
    })
    .populate("owner");
    let currUser = req.user || null;
    res.render("./listings/show.ejs",{listing, currUser});
}));

// Edit Route (to edit the listing)
router.get("/:id/edit", isLoggedIn, wrapAsync (async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

// Update Route (for saving the edited part in database)
router.put("/:id", isLoggedIn, validateListing, wrapAsync (async (req,res) => {
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
router.delete("/:id", isLoggedIn, wrapAsync (async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

module.exports = router;