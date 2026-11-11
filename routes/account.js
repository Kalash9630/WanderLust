const express = require("express");
const router = express.Router();

const accountController = require("../controllers/account.js");
const { isLoggedIn, validateProfile } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

// My Account page
router.get("/", isLoggedIn, wrapAsync(accountController.renderAccount));

// Update profile
router.patch(
    "/",
    isLoggedIn,
    validateProfile,
    wrapAsync(accountController.updateProfile)
);

module.exports = router;