const User = require("../models/user.js");
const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");

// to get the form for Sign up
router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
});

// for saving the user thourgh the backend
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({
        email: email,
        username: username,
      });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", `Welcom to WanderLust   ${username}`);
      res.redirect("/listings");
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
router.get("/login", (req,res) => {
    res.render("./users/login.ejs");
})

// to login the user in the backend
router.post("/login", 
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req,res) => {
        req.flash("success", `Welcome back to WanderLust ${req.user.username}.`);
        res.redirect("/listings");
})

module.exports = router;
