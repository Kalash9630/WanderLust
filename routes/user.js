const User = require("../models/user.js");
const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// to get the form for Sign up
router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
});

// for saving the user thourgh the backend
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({
        email: email,
        username: username,
      });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      //   if user is registerd that automatically login
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", `Welcome to WanderLust ${username}!`);
        return res.redirect("/listings");
      });
    } catch (e) {
      req.flash(
        "error",
        "Username is already registered. Please try another one.",
      );
      res.redirect("/signup");
    }
  }),
);

// to get the form for login page
router.get("/login", (req, res) => {
  res.render("./users/login.ejs");
});

// to login the user in the backend
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success", `Welcome back to WanderLust ${req.user.username}.`);
    res.redirect(redirectUrl);
  },
);

// logout user in backend
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
});

// privacy page
router.get("/privacy", (req, res) => {
  res.render("privacy.ejs");
});

// terms and conditions page
router.get("/terms", (req, res) => {
  res.render("terms.ejs");
});

module.exports = router;
