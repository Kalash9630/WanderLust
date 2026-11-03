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
