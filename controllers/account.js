const User = require("../models/user.js");

// Render My Account page
module.exports.renderAccount = async (req, res) => {
    res.render("account/account.ejs", {
        user: req.user
    });
};

// Update user profile
module.exports.updateProfile = async (req, res) => {
    const { username, mobileNumber, dateOfBirth, sex } = req.body;

    const user = await User.findById(req.user._id);

    // Check whether the username has changed
    if (username.toLowerCase() !== user.username.toLowerCase()) {

        // Check whether another user already has this username
        const existingUser = await User.findOne({
            username: username.toLowerCase(),
            _id: { $ne: user._id }
        });

        if (existingUser) {
            req.flash("error", "Username is already taken. Please choose another one.");
            return res.redirect("/account");
        }

        // Update username using Passport Local Mongoose
        await user.setUsername(username);
    }

    // Update other profile details
    user.mobileNumber = mobileNumber;
    user.dateOfBirth = dateOfBirth || undefined;
    user.sex = sex || undefined;

    await user.save();

    req.flash("success", "Your profile has been updated successfully.");
    return res.status(200).json({
        success: true,
        message: "Your profile has been updated successfully."
    });
};
