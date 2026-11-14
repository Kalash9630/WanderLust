const express = require("express");
const router = express.Router();

const privacyController = require("../controllers/privacy.js");

// privacy page
router.get("/privacy", privacyController.privacy);

module.exports = router;