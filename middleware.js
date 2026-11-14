const { guestDetailsSchema, stayDetailsSchema, contactSchema  } = require("./schema.js");
const { profileSchema } = require("./schema.js");


// to check whether the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {

      // Redirect wishlist requests to Explore after login
      if (req.originalUrl.includes("/wishlist")) {
          req.session.redirectUrl = "/listings";
      } else {
          // Preserve the original redirect for other requests
          req.session.redirectUrl = req.originalUrl;
      }

      req.flash("error", "You must login first!");
      return res.redirect("/login");
  }

  next();
};

// Middleware to save the URL the user originally requested
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// =========================================
// MIDDLEWARE TO VALIDATE GUEST DETAILS
// =========================================

module.exports.validateGuestDetails = (req, res, next) => {
  // Validate the submitted guest details using Joi
  const { error } = guestDetailsSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  // If validation fails, collect all error messages
  if (error) {
    const errorMessages = error.details.map((el) => el.message);

    return res.status(400).json({
      message: errorMessages.join(", "),
    });
  }

  // Continue to the controller if validation succeeds
  next();
};

// Middleware to validate Stay Details
module.exports.validateStayDetails = (req, res, next) => {
  const { error } = stayDetailsSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((el) => el.message);

    return res.status(400).json({
      message: errorMessages.join(", "),
    });
  }

  next();
};

// =========================================
// MIDDLEWARE TO VALIDATE BOOKING CONFIRMATION
// =========================================

module.exports.validateBookingConfirmation = (req, res, next) => {
  // Get the booking details from the session
  const booking = req.session.booking;

  // Check whether a booking session exists
  if (!booking) {
    return res.status(400).json({
      message: "Your booking session has expired. Please start again.",
    });
  }

  // Check whether the booking belongs to the selected listing
  if (!booking.listingId || booking.listingId.toString() !== req.params.id) {
    return res.status(400).json({
      message: "Invalid booking session.",
    });
  }

  // Exclude age before validating guest details
  const { age, ...guestDetails } = booking.guestDetails;

  // Validate guest details without age
  const { error: guestError } = guestDetailsSchema.validate(guestDetails, {
    abortEarly: false,
  });

  if (guestError) {
    return res.status(400).json({
      message: "Guest details are incomplete or invalid. Please review them.",
    });
  }

  // Validate stay details stored in the session
  const { error: stayError } = stayDetailsSchema.validate(
    {
      checkIn: booking.stayDetails?.checkIn,
      checkOut: booking.stayDetails?.checkOut,
    },
    { abortEarly: false },
  );

  if (stayError) {
    return res.status(400).json({
      message: "Stay details are incomplete or invalid. Please review them.",
    });
  }

  // Verify the number of nights
  const checkInDate = new Date(`${booking.stayDetails.checkIn}T00:00:00Z`);
  const checkOutDate = new Date(`${booking.stayDetails.checkOut}T00:00:00Z`);

  const calculatedNights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

  if (
    !Number.isInteger(booking.stayDetails.nights) ||
    booking.stayDetails.nights !== calculatedNights ||
    calculatedNights <= 0
  ) {
    return res.status(400).json({
      message: "Invalid stay duration. Please select your dates again.",
    });
  }

  // Check whether pricing details exist
  if (
    !booking.pricingDetails ||
    !Number.isFinite(booking.pricingDetails.totalPrice)
  ) {
    return res.status(400).json({
      message: "Pricing details are missing. Please review your price.",
    });
  }

  // Continue if all validations pass
  next();
};

// Validate profile update
module.exports.validateProfile = (req, res, next) => {
    const { error } = profileSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const errorMessage = error.details
            .map((detail) => detail.message)
            .join(", ");

        req.flash("error", errorMessage);
        return res.redirect("/account");
    }

    next();
};

// Validate Contact form
module.exports.validateContact = (req, res, next) => {
    const { error } = contactSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const errorMessage = error.details
            .map((detail) => detail.message)
            .join(", ");

        req.flash("error", errorMessage);
        return res.redirect("/contact");
    }

    next();
};