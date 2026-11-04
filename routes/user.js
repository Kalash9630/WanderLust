const User = require("../models/user.js");
const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// to get the form for Sign up
router.get("/signup", userController.signupGet);

// for saving the user thourgh the backend
router.post("/signup", wrapAsync(userController.signupPost));

// to get the form for login page
router.get("/login", userController.loginGet);

// to login the user in the backend
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.loginPost),
);

// logout user in backend
router.get("/logout", userController.logout);

// privacy page
router.get("/privacy", userController.privacy);

// terms and conditions page
router.get("/terms", userController.terms);

module.exports = router;
