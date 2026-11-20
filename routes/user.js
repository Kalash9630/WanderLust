const User = require("../models/user.js");
const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
const oauth2Client = require("../utils/googleAuth.js");

// to get the form for Sign up
router.get("/signup", userController.signupGet);

// for saving the user thourgh the backend
router.post("/signup", wrapAsync(userController.signupPost));

router.get("/check-username", wrapAsync(userController.checkUsername));

router.post("/send-otp", wrapAsync(userController.sendOTP));

router.post("/verify-otp", wrapAsync(userController.verifyOTP));

// to get the form for login page
router.get("/login", userController.loginGet);

// to login the user in the backend
router.post(
  "/login",
  saveRedirectUrl,
  wrapAsync(userController.checkEmailVerified),
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.loginPost),
);

// logout user in backend
router.get("/logout", userController.logout);

// Start Google OAuth authorization
router.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
  });

  res.redirect(authUrl);
});

// Handle Google OAuth callback
router.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);

  console.log("Google OAuth tokens:", tokens);

  res.send(
    "Google authorization successful. Check your terminal for the tokens.",
  );
});

module.exports = router;
