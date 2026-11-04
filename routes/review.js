const express = require("express");
const router = express.Router({mergeParams: true});
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

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
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.add));

// deleting the review route
router.delete("/:reviewId",isLoggedIn, wrapAsync(reviewController.delete));

module.exports = router;