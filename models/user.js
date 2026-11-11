const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;
const Booking = require("./booking.js");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  verificationCodeHash: {
    type: String,
  },

  verificationCodeExpires: {
    type: Date,
  },

  // Reference to the user's bookings
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],

  // Additional personal information
  mobileNumber: {
    type: String,
    trim: true,
  },

  dateOfBirth: {
    type: Date,
  },

  sex: {
    type: String,
    enum: ["male", "female", "other", "prefer_not_to_say"],
  },
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, {
  usernameLowerCase: true,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
