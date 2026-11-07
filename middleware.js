const { guestDetailsSchema, stayDetailsSchema } = require("./schema.js");

// to check whether the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // redierctURL info save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must login first! ");
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
        stripUnknown: true
    });

    // If validation fails, collect all error messages
    if (error) {
        const errorMessages = error.details.map(el => el.message);

        return res.status(400).json({
            message: errorMessages.join(", ")
        });
    }

    // Continue to the controller if validation succeeds
    next();
};

// Middleware to validate Stay Details
module.exports.validateStayDetails = (req, res, next) => {
    const { error } = stayDetailsSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const errorMessages = error.details.map(el => el.message);

        return res.status(400).json({
            message: errorMessages.join(", ")
        });
    }

    next();
};
