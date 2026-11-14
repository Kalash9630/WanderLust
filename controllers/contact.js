const Contact = require("../models/contact.js");

// Display contact page
module.exports.contact = (req, res) => {
    res.render("contact.ejs");
};

// Submit contact form
module.exports.submitContact = async (req, res) => {
    const { name, email, subject, message } = req.body;

    const newContact = new Contact({
        name,
        email,
        subject,
        message
    });

    await newContact.save();

    req.flash("success", "Your message has been send successfully!");
    res.redirect("/contact");
};