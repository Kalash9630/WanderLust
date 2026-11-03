const express = require("express");
const router = express.Router({mergeParams: true});
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn} = require("../middleware.js");

const validateReview = (req,res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// adding review in database
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req,res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    });
    let {rating, comment} = req.body;

    let newReview = new Review({
        rating : rating,
        comment : comment,
        author: req.user._id,
    });

    await newReview.save();

    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${id}`);
}));

// deleting the review route
router.delete("/:reviewId",isLoggedIn, wrapAsync(async (req,res) => {
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

module.exports = router;