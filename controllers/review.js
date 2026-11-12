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

// Delete review
module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params;

    // Find and delete the review
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
        req.flash("error", "Review not found!");
        return res.redirect("/account/reviews");
    }

    // Remove the review reference from its associated listing
    await Listing.updateOne(
        { reviews: reviewId },
        { $pull: { reviews: reviewId } }
    );

    req.flash("success", "Review deleted successfully!");

    // Redirect based on the page from which the review was deleted
    const redirectUrl = req.get("Referrer")?.includes("/account/reviews")
        ? "/account/reviews"
        : `/listings/${id}`;

    res.redirect(redirectUrl);
};