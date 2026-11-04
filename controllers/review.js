const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.add = async (req,res) => {
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
}

module.exports.delete = async (req,res) => {
    let reviewId = req.params.reviewId;
    let id = req.params.id;

    // deleting from reivews collection
    let deleteReview = await Review.findByIdAndDelete(reviewId);
    console.log(deleteReview);

    // deleting from listing collection
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}