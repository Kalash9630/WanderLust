const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const User = require("../models/user.js");
const { sendBookingConfirmationEmail } = require("../utils/mailer.js");
// =========================================
// GUEST DETAILS - GET CONTROLLER
// =========================================

module.exports.renderGuestDetails = async (req, res) => {
  // Get the selected listing
  const listing = await Listing.findById(req.params.id);

  // Check whether the listing exists
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Initialize guest details
  let guestDetails = {};

  // Check whether guest details already exist in the current session
  if (
    req.session.booking &&
    req.session.booking.listingId.toString() === listing._id.toString()
  ) {
    guestDetails = req.session.booking.guestDetails || {};
  } else {
    // Retrieve the user's most recent booking from MongoDB
    const previousBooking = await Booking.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    // Reuse previously saved guest details
    if (previousBooking) {
      guestDetails = previousBooking.guestDetails;
    }
  }

  // Render Guest Details page
  res.render("bookings/guestDetails.ejs", {
    listing,
    guestDetails: guestDetails || {},
  });
};

// =========================================
// GUEST DETAILS - POST CONTROLLER
// =========================================

// SAVE GUEST DETAILS IN SESSION

module.exports.saveGuestDetails = async (req, res) => {
  // Get the selected listing
  const listing = await Listing.findById(req.params.id);

  // Check whether the listing exists
  if (!listing) {
    return res.status(404).json({
      message: "Listing not found!",
    });
  }

  // =====================================
  // EXTRACT GUEST DETAILS
  // =====================================

  // These details have already been validated by Joi middleware
  const { fullName, mobileNumber, dateOfBirth, sex } = req.body;

  // =====================================
  // CALCULATE GUEST AGE
  // =====================================

  // Convert the date of birth into a Date object
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);

  // Get today's date
  const today = new Date();

  // Calculate the difference between the years
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust the age if the birthday has not occurred yet this year
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // =====================================
  // STORE BOOKING DETAILS IN SESSION
  // =====================================

  req.session.booking = {
    listingId: listing._id,

    guestDetails: {
      fullName: fullName.trim().toLowerCase(),
      email: req.user.email,
      mobileNumber: mobileNumber.trim(),
      dateOfBirth: dateOfBirth,
      age: age,
      sex: sex,
    },
  };

  // =====================================
  // SEND SUCCESS RESPONSE
  // =====================================

  res.json({
    success: true,
    redirectUrl: `/listings/${listing._id}/book/stay-details`,
  });
};

// =========================================
// STAY DETAILS - GET CONTROLLER
// =========================================

// DISPLAY STAY DETAILS PAGE

module.exports.renderStayDetails = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  let stayDetails = {};

  if (
    req.session.booking &&
    req.session.booking.listingId.toString() === listing._id.toString()
  ) {
    stayDetails = req.session.booking.stayDetails || {};
  }

  res.render("bookings/stayDetails.ejs", {
    listing,
    stayDetails,
  });
};
// =========================================
// STAY DETAILS - POST CONTROLLER
// =========================================

module.exports.saveStayDetails = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      message: "Listing not found!",
    });
  }

  const { checkIn, checkOut } = req.body;

  // Calculate the number of nights
  const checkInDate = new Date(`${checkIn}T00:00:00Z`);
  const checkOutDate = new Date(`${checkOut}T00:00:00Z`);

  const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

  // Store stay details in the existing booking session
  req.session.booking = {
    ...req.session.booking,
    listingId: listing._id,
    stayDetails: {
      checkIn,
      checkOut,
      nights,
    },
  };

  res.json({
    success: true,
    redirectUrl: `/listings/${listing._id}/book/pricing-details`,
  });
};

// Render Pricing Details page
module.exports.renderPricingDetails = async (req, res) => {
  // Find the selected listing
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Check whether booking session exists
  if (
    !req.session.booking ||
    req.session.booking.listingId.toString() !== listing._id.toString()
  ) {
    req.flash("error", "Please complete your booking details first!");
    return res.redirect(`/listings/${listing._id}/book/guest-details`);
  }

  // Check whether guest and stay details exist
  if (!req.session.booking.guestDetails || !req.session.booking.stayDetails) {
    req.flash("error", "Please complete your previous booking steps!");
    return res.redirect(`/listings/${listing._id}/book/guest-details`);
  }

  // Render Pricing Details page
  res.render("bookings/pricingDetails.ejs", {
    listing,
    booking: req.session.booking,
  });
};

// SAVE PRICING DETAILS

module.exports.savePricingDetails = async (req, res) => {
  // Find the selected listing
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      message: "Listing not found!",
    });
  }

  // Verify previous booking details
  if (
    !req.session.booking ||
    req.session.booking.listingId.toString() !== listing._id.toString() ||
    !req.session.booking.guestDetails ||
    !req.session.booking.stayDetails
  ) {
    return res.status(400).json({
      message: "Please complete your previous booking details first.",
    });
  }

  // Get the number of nights from the booking session
  const nights = req.session.booking.stayDetails.nights;

  // Get the actual listing price
  const nightlyPrice = Number(listing.price);

  // Calculate accommodation price
  const accommodationPrice = nightlyPrice * nights;

  // Calculate platform fee (2%)
  const platformFee = accommodationPrice * 0.02;

  // Calculate taxes (5%)
  const taxAmount = accommodationPrice * 0.05;

  // Calculate total amount
  const totalPrice = accommodationPrice + platformFee + taxAmount;

  // Save pricing details in the existing booking session
  req.session.booking.pricingDetails = {
    accommodationPrice,
    platformFee,
    taxAmount,
    totalPrice,
  };

  // Send success response
  res.json({
    success: true,
    message: "Pricing details saved successfully.",
  });
};

// RENDER REVIEW DETAILS PAGE
module.exports.renderReviewDetails = async (req, res) => {
  // Find the selected listing
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Check whether a booking session exists for this listing
  if (
    !req.session.booking ||
    req.session.booking.listingId.toString() !== listing._id.toString()
  ) {
    req.flash("error", "Please complete your booking details first!");
    return res.redirect(`/listings/${listing._id}/book/guest-details`);
  }

  // Ensure guest and stay details are available
  if (!req.session.booking.guestDetails || !req.session.booking.stayDetails) {
    req.flash("error", "Please complete your previous booking steps!");
    return res.redirect(`/listings/${listing._id}/book/guest-details`);
  }

  // Ensure pricing details are available
  if (!req.session.booking.pricingDetails) {
    req.flash("error", "Please complete the pricing details first!");
    return res.redirect(`/listings/${listing._id}/book/pricing-details`);
  }

  // Pass the listing and booking data to the review page
  res.render("bookings/reviewDetails.ejs", {
    listing,
    booking: req.session.booking,
  });
};

// CANCEL BOOKING
module.exports.cancelBooking = async (req, res) => {
  // Check whether a booking session exists
  if (!req.session.booking) {
    req.flash("error", "No active booking found!");
    return res.redirect("/listings");
  }

  // Remove all booking data from the session
  delete req.session.booking;

  // Show cancellation message and redirect to listings
  req.flash("success", "Your booking has been cancelled successfully!");
  res.redirect("/listings");
};

// =========================================
// CONFIRM BOOKING CONTROLLER
// =========================================

module.exports.confirmBooking = async (req, res) => {
  // Find the selected listing
  const listing = await Listing.findById(req.params.id);

  // Check whether the listing exists
  if (!listing) {
    return res.status(404).json({
      message: "Listing not found!",
    });
  }

  // Get the booking details from the session
  const booking = req.session.booking;

  // Get the verified booking information
  const { guestDetails, stayDetails, pricingDetails } = booking;

  // Generate a unique booking reference
  const bookingReference = "WL" + Date.now().toString().slice(-8);

  // Create the booking document in MongoDB
  const newBooking = new Booking({
    // Store user and listing references
    user: req.user._id,
    listing: listing._id,

    // Store guest information
    guestDetails: {
      fullName: guestDetails.fullName.trim().toLowerCase(),
      email: guestDetails.email,
      mobileNumber: guestDetails.mobileNumber,
      dateOfBirth: guestDetails.dateOfBirth,
      sex: guestDetails.sex,
    },

    // Store stay information
    stayDetails: {
      checkIn: stayDetails.checkIn,
      checkOut: stayDetails.checkOut,
      nights: stayDetails.nights,
    },

    // Store existing verified pricing information
    pricingDetails: {
      accommodationPrice: pricingDetails.accommodationPrice,
      platformFee: pricingDetails.platformFee,
      taxAmount: pricingDetails.taxAmount,
      totalPrice: pricingDetails.totalPrice,
    },

    // Store unique booking reference
    bookingReference: bookingReference,
  });

  // Save the booking document
  await newBooking.save();

  // Add the booking reference to the User document
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { bookings: newBooking._id },
  });

  // Add the booking reference to the Listing document
  await Listing.findByIdAndUpdate(listing._id, {
    $addToSet: { bookings: newBooking._id },
  });

  // Clear temporary booking data from the session
  delete req.session.booking;
  
  // Send booking confirmation email
  try {
      await sendBookingConfirmationEmail({
          ...newBooking.toObject(),
          listing: listing,
      });
  } catch (error) {
      // Email failure should not cancel the confirmed booking
      console.error("Booking confirmation email failed:", error);
  }
  
  // Redirect to the booking success page
  return res.redirect(`/listings/success/${newBooking._id}`);
};

// =========================================
// RENDER BOOKING SUCCESS PAGE
// =========================================

module.exports.renderBookingSuccess = async (req, res) => {

    // Find the confirmed booking belonging to the logged-in user
    const booking = await Booking.findOne({
        _id: req.params.bookingId,
        user: req.user._id
    }).populate("listing");

    // Check whether the booking exists
    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/listings");
    }

    // Render the Booking Success page
    res.render("bookings/bookingSuccess.ejs", {
        booking
    });
};