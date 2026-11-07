const mongoose = require("mongoose");

// =========================================
// BOOKING SCHEMA
// =========================================

const bookingSchema = new mongoose.Schema({

    // Reference to the user who made the booking
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Reference to the booked property
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    // Guest information
    guestDetails: {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        sex: {
            type: String,
            enum: ["male", "female", "other", "prefer_not_to_say"],
            required: true
        }
    },

    // Stay information
    stayDetails: {
        checkIn: {
            type: Date,
            required: true
        },
        checkOut: {
            type: Date,
            required: true
        },
        nights: {
            type: Number,
            required: true
        }
    },

    // Pricing information
    pricingDetails: {
        accommodationPrice: {
            type: Number,
            required: true
        },
        platformFee: {
            type: Number,
            required: true
        },
        taxAmount: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        }
    },

    // Unique booking reference
    bookingReference: {
        type: String,
        required: true,
        unique: true
    },

}, { timestamps: true });

// =========================================
// BOOKING MODEL
// =========================================

module.exports = mongoose.model("Booking", bookingSchema);