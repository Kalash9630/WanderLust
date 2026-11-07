const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateGuestDetails, validateStayDetails } = require("../middleware.js");

const bookingController = require("../controllers/booking.js");

// =========================================
// GUEST DETAILS - GET ROUTE
// =========================================

router.get(
  "/:id/book/guest-details",
  isLoggedIn,
  wrapAsync(bookingController.renderGuestDetails),
);

// =========================================
// GUEST DETAILS - POST ROUTE
// =========================================

router.post(
  "/:id/book/guest-details",
  isLoggedIn,
  validateGuestDetails,
  wrapAsync(bookingController.saveGuestDetails),
);

// =========================================
// STAY DETAILS - GET ROUTE
// =========================================

router.get(
    "/:id/book/stay-details",
    isLoggedIn,
    wrapAsync(bookingController.renderStayDetails)
);

// Stay Details POST
router.post(
    "/:id/book/stay-details",
    isLoggedIn,
    validateStayDetails,
    wrapAsync(bookingController.saveStayDetails)
);

// PRICING DETAILS GET
router.get(
    "/:id/book/pricing-details",
    isLoggedIn,
    wrapAsync(bookingController.renderPricingDetails)
);

// PRICING DETAILS POST
router.post(
    "/:id/book/pricing-details",
    isLoggedIn,
    wrapAsync(bookingController.savePricingDetails)
);

// REVIEW DETAILS GET
router.get(
    "/:id/book/review-details",
    isLoggedIn,
    wrapAsync(bookingController.renderReviewDetails)
);

// CANCEL BOOKING POST
router.post(
    "/:id/book/cancel",
    isLoggedIn,
    wrapAsync(bookingController.cancelBooking)
);

module.exports = router;
