const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");

// Render My Account page
module.exports.renderAccount = async (req, res) => {
  res.render("account/account.ejs", {
    user: req.user,
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
      _id: { $ne: user._id },
    });

    if (existingUser) {
      req.flash(
        "error",
        "Username is already taken. Please choose another one.",
      );
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
    message: "Your profile has been updated successfully.",
  });
};

// Render My Bookings page
module.exports.renderBookings = async (req, res) => {
  // Find the logged-in user and populate bookings with their listings
  const user = await User.findById(req.user._id).populate({
    path: "bookings",
    populate: {
      path: "listing",
    },
  });

  // Get the user's bookings
  const userBookings = user.bookings;

  // Render My Bookings page
  res.render("account/bookings.ejs", {
    userBookings,
  });
};

module.exports.deleteBooking = async (req, res) => {
  const { bookingId } = req.params;

  // Find the booking
  const booking = await Booking.findById(bookingId);

  // Check whether the booking exists
  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/account/bookings");
  }

  // Verify that the booking belongs to the logged-in user
  if (booking.user.toString() !== req.user._id.toString()) {
    req.flash("error", "You are not authorized to cancel this booking!");
    return res.redirect("/account/bookings");
  }

  // Delete the booking from the Bookings collection
  await Booking.findByIdAndDelete(bookingId);

  // Remove the booking ID from the user's bookings array
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { bookings: bookingId },
  });

  // Remove the booking ID from the listing's bookings array
  await Listing.findByIdAndUpdate(booking.listing, {
    $pull: { bookings: bookingId },
  });

  req.flash("success", "Booking cancelled successfully!");
  res.redirect("/account/bookings");
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
    wishlistCount: wishlistItems.length,
  });
};

// Render My Listings page
module.exports.renderListings = async (req, res) => {
  // Find listings created by the logged-in user
  const userListings = await Listing.find({
    owner: req.user._id,
  });

  // Render My Listings page
  res.render("account/listings.ejs", {
    userListings,
  });
};

// Render My Reviews page
module.exports.renderReviews = async (req, res) => {
  // Find reviews written by the logged-in user
  const userReviews = await Review.find({
    author: req.user._id,
  });

  // Find the listing associated with each review
  const reviewsWithListing = await Promise.all(
    userReviews.map(async (review) => {
      const listing = await Listing.findOne({
        reviews: review._id,
      });

      return {
        ...review.toObject(),
        listingId: listing ? listing._id : null,
        listing: listing,
      };
    }),
  );

  // Render My Reviews page
  res.render("account/reviews.ejs", {
    userReviews: reviewsWithListing,
  });
};

// Render Account Settings page
module.exports.renderSettings = async (req, res) => {

    // Get password verification statuses from the session

    const passwordChangeVerified =
        req.session.passwordChangeVerified || false;

    const accountDeletionVerified =
        req.session.accountDeletionVerified || false;

    res.render("account/settings.ejs", {
        passwordChangeVerified,
        accountDeletionVerified
    });
};

// Verify the user's current password
module.exports.verifyCurrentPassword = async (req, res) => {
    const { currentPassword } = req.body;

    // Validate current password length
    if (!currentPassword || currentPassword.length < 3) {
        req.flash("error", "Password must contain at least 3 characters.");
        return res.redirect("/account/settings");
    }

    try {
        // Find the logged-in user
        const user = await User.findById(req.user._id);

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/account/settings");
        }

        // Verify the current password
        const authenticationResult = await user.authenticate(currentPassword);
        
        // Check whether authentication was successful
        const isPasswordValid = Boolean(authenticationResult.user);

        if (!isPasswordValid) {
            req.session.passwordChangeVerified = false;
            req.flash("error", "Incorrect current password. Please try again.");
            return res.redirect("/account/settings");
        }

        // Store successful verification in the session
        req.session.passwordChangeVerified = true;

        req.flash("success", "Password verified successfully!");

        return res.redirect("/account/settings");

    } catch (error) {
        console.error("Password verification error:", error);

        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/account/settings");
    }
};

// Change the user's password
module.exports.changePassword = async (req, res) => {
    const { newPassword, confirmNewPassword } = req.body;

    try {
        // Check whether the current password was verified
        if (!req.session.passwordChangeVerified) {
            req.flash("error", "Please verify your current password first.");
            return res.redirect("/account/settings");
        }

        // Validate the new password
        if (!newPassword || newPassword.length < 3) {
            req.flash("error", "New password must contain at least 3 characters.");
            return res.redirect("/account/settings");
        }

        // Check whether both passwords match
        if (newPassword !== confirmNewPassword) {
            req.flash("error", "New passwords do not match.");
            return res.redirect("/account/settings");
        }

        // Find the logged-in user
        const user = await User.findById(req.user._id);

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/account/settings");
        }

        // Update the password using Passport Local Mongoose
        await user.setPassword(newPassword);

        // Save the updated user
        await user.save();

        // Clear the password verification status
        req.session.passwordChangeVerified = false;

        req.flash("success", "Your password has been changed successfully!");

        return res.redirect("/account/settings");

    } catch (error) {
        console.error("Password change error:", error);

        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/account/settings");
    }
};

// Cancel the password change process
module.exports.cancelPasswordChange = async (req, res) => {

    // Clear the password verification status
    req.session.passwordChangeVerified = false;

    req.flash("success", "Password change canceled");

    // Redirect to Account Settings
    return res.redirect("/account/settings");
};

// Verify current password before deleting the account
module.exports.verifyDeletePassword = async (req, res) => {
    const { currentPassword } = req.body;

    // Validate current password length
    if (!currentPassword || currentPassword.length < 3) {
        req.flash("error", "Password must contain at least 3 characters.");
        return res.redirect("/account/settings");
    }

    try {
        // Find the logged-in user
        const user = await User.findById(req.user._id);

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/account/settings");
        }

        // Verify the current password
        const authenticationResult = await user.authenticate(currentPassword);

        const isPasswordValid = Boolean(authenticationResult.user);

        // Check whether authentication was successful
        if (!isPasswordValid) {
            req.session.accountDeletionVerified = false;
            req.flash("error", "Incorrect current password. Please try again.");
            return res.redirect("/account/settings");
        }

        // Store successful verification in the session
        req.session.accountDeletionVerified = true;

        req.flash("success", "Password verified successfully!");

        return res.redirect("/account/settings");

    } catch (error) {
        console.error("Account deletion password verification error:", error);

        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/account/settings");
    }
};

// Cancel the account deletion process
module.exports.cancelDeleteAccount = async (req, res) => {

    // Clear the account deletion verification status
    req.session.accountDeletionVerified = false;

    req.flash("success", "Account Deletion canceled");

    // Redirect to Account Settings
    return res.redirect("/account/settings");
};


// Permanently delete the user's account and associated data
module.exports.deleteAccount = async (req, res) => {
    try {
        // Check whether the current password was verified
        if (!req.session.accountDeletionVerified) {
            req.flash("error", "Please verify your current password first.");
            return res.redirect("/account/settings");
        }

        const userId = req.user._id;

        // Find all listings owned by the logged-in user
        const userListings = await Listing.find({
            owner: userId
        }).select("_id reviews");

        const listingIds = userListings.map(listing => listing._id);

        // Collect reviews associated with the user's listings
        const listingReviewIds = userListings.flatMap(listing => listing.reviews);

        // Find reviews written by the user or associated with their listings
        const reviews = await Review.find({
            $or: [
                { author: userId },
                { _id: { $in: listingReviewIds } }
            ]
        }).select("_id");

        const reviewIds = reviews.map(review => review._id);

        // Find bookings made by the user or associated with their listings
        const bookings = await Booking.find({
            $or: [
                { user: userId },
                { listing: { $in: listingIds } }
            ]
        }).select("_id");

        const bookingIds = bookings.map(booking => booking._id);

        // Remove deleted listing IDs from other users' wishlists
        if (listingIds.length > 0) {
            await User.updateMany(
                { wishlist: { $in: listingIds } },
                { $pull: { wishlist: { $in: listingIds } } }
            );
        }

        // Remove review references from all affected listings
        if (reviewIds.length > 0) {
            await Listing.updateMany(
                { reviews: { $in: reviewIds } },
                { $pull: { reviews: { $in: reviewIds } } }
            );

            // Delete the associated reviews
            await Review.deleteMany({
                _id: { $in: reviewIds }
            });
        }

        // Remove booking references from all affected users
        if (bookingIds.length > 0) {
            await User.updateMany(
                { bookings: { $in: bookingIds } },
                { $pull: { bookings: { $in: bookingIds } } }
            );

            // Remove booking references from all affected listings
            await Listing.updateMany(
                { bookings: { $in: bookingIds } },
                { $pull: { bookings: { $in: bookingIds } } }
            );

            // Delete the associated bookings
            await Booking.deleteMany({
                _id: { $in: bookingIds }
            });
        }

        // Delete all listings owned by the user
        await Listing.deleteMany({
            owner: userId
        });

        // Delete the user document
        await User.findByIdAndDelete(userId);

        // Log out the user
        await new Promise((resolve, reject) => {
            req.logout((err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });

        // Destroy the user's session
        await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });

        // Clear the session cookie
        res.clearCookie("connect.sid");
        req.flash("success", "Account Deleted successfully!");
        return res.redirect("/listings");

    } catch (error) {
        console.error("Account deletion error:", error);

        req.flash("error", "Unable to delete your account. Please try again.");
        return res.redirect("/account/settings");
    }
};
