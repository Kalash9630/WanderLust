const User = require("../models/user.js");

module.exports.renderAccount = async (req, res) => {
    res.render("account/account.ejs");
};
