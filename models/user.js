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
});

userSchema.plugin(passportLocalMongoose, {
  usernameLowerCase: true,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
