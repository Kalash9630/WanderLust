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