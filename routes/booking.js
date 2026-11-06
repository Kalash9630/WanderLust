
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const {
    isLoggedIn,
    validateGuestDetails
} = require("../middleware.js");

const bookingController = require("../controllers/booking.js");

// =========================================
// GUEST DETAILS - GET ROUTE
// =========================================

router.get(
    "/:id/book/guest-details",
    isLoggedIn,
    wrapAsync(bookingController.renderGuestDetails)
);

// =========================================
// GUEST DETAILS - POST ROUTE
// =========================================

router.post(
    "/:id/book/guest-details",
    isLoggedIn,
    validateGuestDetails,
    wrapAsync(bookingController.saveGuestDetails)
);


module.exports = router;
