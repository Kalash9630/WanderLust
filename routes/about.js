const express = require("express");
const router = express.Router();

const aboutController = require("../controllers/about.js");

// about page
router.get("/about", aboutController.about);

module.exports = router;