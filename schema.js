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

// Stay Details validation
module.exports.stayDetailsSchema = Joi.object({
    checkIn: Joi.date()
        .iso()
        .min("now")
        .required()
        .messages({
            "date.base": "Please enter a valid check-in date.",
            "date.min": "Check-in date cannot be in the past.",
            "any.required": "Check-in date is required."
        }),

    checkOut: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "Please enter a valid check-out date.",
            "any.required": "Check-out date is required."
        })
}).custom((value, helpers) => {
    if (value.checkOut <= value.checkIn) {
        return helpers.error("date.checkout");
    }

    return value;
}).messages({
    "date.checkout": "Check-out date must be after the check-in date."
});

// =========================================
// PROFILE UPDATE VALIDATION
// =========================================

module.exports.profileSchema = Joi.object({
    username: Joi.string()
        .trim()
        .min(2)
        .required()
        .messages({
            "string.empty": "Username is required.",
            "string.min": "Username must contain at least 2 characters.",
            "any.required": "Username is required."
        }),

    mobileNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .allow("")
        .messages({
            "string.pattern.base": "Mobile number must contain exactly 10 digits."
        }),

    dateOfBirth: Joi.date()
        .iso()
        .max("now")
        .allow("", null)
        .messages({
            "date.base": "Please enter a valid date of birth.",
            "date.max": "Date of birth cannot be in the future."
        }),

    sex: Joi.string()
        .valid("male", "female", "other", "prefer_not_to_say")
        .allow("")
        .messages({
            "any.only": "Please select a valid gender."
        })
});

// for contact section validation
module.exports.contactSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Name is required.",
            "any.required": "Name is required."
        }),

    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Please enter a valid email address.",
            "any.required": "Email is required."
        }),

    subject: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Subject is required.",
            "any.required": "Subject is required."
        }),

    message: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Message is required.",
            "any.required": "Message is required."
        })
});