const Joi = require("joi");

// listing model validation
module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().allow("", null).optional(),
  price: Joi.number().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

// review model validation
module.exports.reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required(),
});

// =========================================
// GUEST DETAILS VALIDATION
// =========================================

module.exports.guestDetailsSchema = Joi.object({
    fullName: Joi.string()
        .trim()
        .min(2)
        .pattern(/^[a-zA-Z]+(?:[ '-][a-zA-Z]+)*$/)
        .required()
        .messages({
            "string.empty": "Full name is required.",
            "string.min": "Full name must contain at least 2 characters.",
            "string.pattern.base": "Please enter a valid full name.",
            "any.required": "Full name is required."
        }),

    mobileNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "string.empty": "Mobile number is required.",
            "string.pattern.base": "Mobile number must contain exactly 10 digits.",
            "any.required": "Mobile number is required."
        }),

    dateOfBirth: Joi.date()
        .iso()
        .max("now")
        .required()
        .messages({
            "date.base": "Please enter a valid date of birth.",
            "date.max": "Date of birth cannot be in the future.",
            "any.required": "Date of birth is required."
        }),

    sex: Joi.string()
        .valid("male", "female", "other", "prefer_not_to_say")
        .required()
        .messages({
            "any.only": "Please select a valid option.",
            "any.required": "Sex is required."
        }),

    // Email is obtained from the logged-in user.
    // This field is optional if the form submits it.
    email: Joi.string().email().optional()
});