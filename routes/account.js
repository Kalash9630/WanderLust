const express = require("express");
const router = express.Router();

const accountController = require("../controllers/account.js");
const { isLoggedIn, validateProfile } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

// My Account page
router.get("/", isLoggedIn, wrapAsync(accountController.renderAccount));

// Update profile
router.patch(
    "/",
    isLoggedIn,
    validateProfile,
    wrapAsync(accountController.updateProfile)
);

// Render My Bookings page
router.get("/bookings", isLoggedIn, wrapAsync(accountController.renderBookings));

// Cancel booking
router.delete(
    "/bookings/:bookingId",
    isLoggedIn,
    wrapAsync(accountController.deleteBooking)
);

// My Wishlist
router.get(
    "/wishlist",
    isLoggedIn,
    wrapAsync(accountController.renderWishlist)
);

// Render My Listings page
router.get("/listings", isLoggedIn, wrapAsync(accountController.renderListings));

// Render My Reviews page
router.get("/reviews", isLoggedIn, wrapAsync(accountController.renderReviews));

// Account Settings page
router.get(
    "/settings",
    isLoggedIn,
    wrapAsync(accountController.renderSettings)
);

// Verify current password before changing it
router.post(
    "/verify-password",
    isLoggedIn,
    wrapAsync(accountController.verifyCurrentPassword)
);

// Change password
router.post(
    "/change-password",
    isLoggedIn,
    wrapAsync(accountController.changePassword)
);

// Cancel password change
router.post(
    "/cancel-password-change",
    isLoggedIn,
    wrapAsync(accountController.cancelPasswordChange)
);

// Verify password before account deletion
router.post(
    "/verify-delete-password",
    isLoggedIn,
    wrapAsync(accountController.verifyDeletePassword)
);

// Cancel account deletion
router.post(
    "/cancel-delete",
    isLoggedIn,
    wrapAsync(accountController.cancelDeleteAccount)
);

// Permanently delete account
router.delete(
    "/delete",
    isLoggedIn,
    wrapAsync(accountController.deleteAccount)
);

module.exports = router;