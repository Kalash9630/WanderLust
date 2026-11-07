const Listing = require("../models/listing.js");

// =========================================
// GUEST DETAILS - GET CONTROLLER
// =========================================

// DISPLAY GUEST DETAILS PAGE

module.exports.renderGuestDetails = async (req, res) => {

    // Get the selected listing
    const listing = await Listing.findById(req.params.id);

    // Check whether the listing exists
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Retrieve previously saved guest details from the session
    let guestDetails = {};

    if (
        req.session.booking &&
        req.session.booking.listingId.toString() === listing._id.toString()
    ) {
        guestDetails = req.session.booking.guestDetails;
    }

    // Render Guest Details page with previously saved information
    res.render("bookings/guestDetails.ejs", {
        listing,
        guestDetails: guestDetails || {}
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
  // Get the selected listing using its ID
  const listing = await Listing.findById(req.params.id);

  // Check whether the listing exists
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Display the Stay Details page
  res.render("bookings/stayDetails.ejs", {
    listing,
  });
};

// =========================================
// STAY DETAILS - POST CONTROLLER
// =========================================

module.exports.saveStayDetails = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
      return res.status(404).json({
          message: "Listing not found!"
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
          nights
      }
  };

  res.json({
      success: true,
      redirectUrl: `/listings/${listing._id}/book/pricing`
  });
};
