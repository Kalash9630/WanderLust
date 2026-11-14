const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contact.js");
const { validateContact } = require("../middleware.js");

// contact page
router.get("/contact", contactController.contact);

// submit contact form
router.post("/contact", validateContact, contactController.submitContact);

module.exports = router;