const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// Render My Account page
module.exports.renderAccount = async (req, res) => {
    res.render("account/account.ejs", {
        user: req.user
    });
};

// Update user profile
module.exports.updateProfile = async (req, res) => {
    const { username, mobileNumber, dateOfBirth, sex } = req.body;

    const user = await User.findById(req.user._id);

    // Check whether the username has changed
    if (username.toLowerCase() !== user.username.toLowerCase()) {

        // Check whether another user already has this username
        const existingUser = await User.findOne({
            username: username.toLowerCase(),
            _id: { $ne: user._id }
        });

        if (existingUser) {
            req.flash("error", "Username is already taken. Please choose another one.");
            return res.redirect("/account");
        }

        // Update username using Passport Local Mongoose
        await user.setUsername(username);
    }

    // Update other profile details
    user.mobileNumber = mobileNumber;
    user.dateOfBirth = dateOfBirth || undefined;
    user.sex = sex || undefined;

    await user.save();

    req.flash("success", "Your profile has been updated successfully.");
    return res.status(200).json({
        success: true,
        message: "Your profile has been updated successfully."
    });
};

// Render My Wishlist page
module.exports.renderWishlist = async (req, res) => {

    // Populate the user's wishlist with actual listing documents
    const user = await User.findById(req.user._id).populate("wishlist");

    // Get the wishlist properties
    const wishlistItems = user.wishlist;

    // Render the wishlist page
    res.render("account/wishlist.ejs", {
        wishlistItems,
        wishlistCount: wishlistItems.length
    });
};

// Render My Listings page
module.exports.renderListings = async (req, res) => {

    // Find listings created by the logged-in user
    const userListings = await Listing.find({
        owner: req.user._id
    });

    // Render My Listings page
    res.render("account/listings.ejs", {
        userListings
    });
};

// Render My Reviews page
module.exports.renderReviews = async (req, res) => {

    // Find reviews written by the logged-in user
    const userReviews = await Review.find({
        author: req.user._id
    });

    // Find the listing associated with each review
    const reviewsWithListing = await Promise.all(
        userReviews.map(async (review) => {

            const listing = await Listing.findOne({
                reviews: review._id
            });

            return {
                ...review.toObject(),
                listingId: listing ? listing._id : null,
                listing: listing
            };
        })
    );

    // Render My Reviews page
    res.render("account/reviews.ejs", {
        userReviews: reviewsWithListing
    });
};