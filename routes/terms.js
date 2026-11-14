const express = require("express");
const router = express.Router();

const termsController = require("../controllers/terms.js");

// terms and conditions page
router.get("/terms", termsController.terms);

module.exports = router;