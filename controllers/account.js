const User = require("../models/user.js");

module.exports.renderAccount = async (req, res) => {
    // Render the account page with the logged-in user's details
    res.render("account/account.ejs", {
        user: req.user
    });
};