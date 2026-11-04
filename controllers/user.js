const User = require("../models/user.js");

module.exports.signupGet = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.signupPost = async (req, res, next) => {
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
};

module.exports.loginGet = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.loginPost = async (req, res) => {
  let redirectUrl = res.locals.redirectUrl || "/listings";
  req.flash("success", `Welcome back to WanderLust ${req.user.username}.`);
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};

module.exports.privacy = (req, res) => {
  res.render("privacy.ejs");
};

module.exports.terms = (req, res) => {
  res.render("terms.ejs");
};
