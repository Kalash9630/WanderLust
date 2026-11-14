const User = require("../models/user.js");
const { generateOTP, hashOTP } = require("../utils/otp.js");
const { sendVerificationEmail } = require("../utils/mailer.js");

module.exports.checkEmailVerified = async (req, res, next) => {
  const username = req.body.username?.trim().toLowerCase();

  const user = await User.findOne({ username });

  if (user && !user.isEmailVerified) {
    req.flash("error", "Please verify your email before logging in.");

    return res.redirect("/login");
  }

  next();
};

// singup for displaying
module.exports.signupGet = (req, res) => {
  res.render("./users/signup.ejs", {
    verifiedSignup: req.session.pendingSignup?.isEmailVerified
      ? req.session.pendingSignup
      : null,
  });
};


// acutally signing up in backend
module.exports.signupPost = async (req, res, next) => {
  try {
    const pendingSignup = req.session.pendingSignup;
    const { username, email, password } = req.body;

    // 1. Check whether email verification is completed
    if (!pendingSignup || !pendingSignup.isEmailVerified) {
      req.flash("error", "Please verify your email before registering.");
      return res.redirect("/signup");
    }

    // 2. Ensure submitted details match the verified details
    if (
      username?.trim().toLowerCase() !== pendingSignup.username ||
      email?.trim().toLowerCase() !== pendingSignup.email
    ) {
      req.flash("error", "Signup details do not match the verified details.");
      return res.redirect("/signup");
    }

    // 3. Validate password
    // Validate password
    if (!password || password.length < 3) {
      return res.status(400).render("./users/signup.ejs", {
        signupError: "Password must contain at least 3 characters.",
        verifiedSignup: pendingSignup,
      });
    }

    // 4. Check username and email again before registration
    const existingUser = await User.findOne({
      $or: [
        { username: pendingSignup.username },
        { email: pendingSignup.email },
      ],
    });

    if (existingUser) {
      delete req.session.pendingSignup;

      req.flash("error", "Username or email is already registered.");
      return res.redirect("/signup");
    }

    // 5. Create a verified user
    const newUser = new User({
      username: pendingSignup.username,
      email: pendingSignup.email,
      isEmailVerified: true,
    });

    // 6. Register user (Passport hashes the password)
    const registeredUser = await User.register(newUser, password);

    // 7. Clear temporary signup information
    delete req.session.pendingSignup;

    // 8. Log in the newly registered user
    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", `Welcome to WanderLust ${registeredUser.username}!`);

      return res.redirect("/listings");
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      req.flash("error", "Username or email is already registered.");
      return res.redirect("/signup");
    }

    next(error);
  }
};

// Check username availability
module.exports.checkUsername = async (req, res) => {
  const username = req.query.username?.trim().toLowerCase();

  if (!username || username.length < 3) {
    return res.status(400).json({
      available: false,
      message: "Username must contain at least 3 characters.",
    });
  }

  const existingUser = await User.findOne({
    username: username,
  });

  if (existingUser) {
    return res.json({
      available: false,
      message: "Username is already taken.",
    });
  }

  return res.json({
    available: true,
    message: "Username is available!",
  });
};

// Check email availability and send OTP
module.exports.sendOTP = async (req, res) => {
  try {
    const username = req.body.username?.trim().toLowerCase();
    const email = req.body.email?.trim().toLowerCase();

    // Validate input
    if (!username || !email) {
      return res.status(400).json({
        message: "Username and email are required.",
      });
    }

    // Check whether username already exists
    const existingUsername = await User.findOne({
      username: username,
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username is already taken.",
      });
    }

    // Check whether email already exists
    const existingEmail = await User.findOne({
      email: email,
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Send OTP to the actual email address
    await sendVerificationEmail(email, otp);

    // Store temporary signup information in the session
    req.session.pendingSignup = {
      username: username,
      email: email,
      verificationCodeHash: hashOTP(otp),
      verificationCodeExpires: Date.now() + 5 * 60 * 1000,
    };

    return res.json({
      message: "Verification code sent successfully to your email.",
    });
  } catch (error) {
    console.error("OTP sending error:", error);

    return res.status(500).json({
      message: "Unable to send verification code. Please try again.",
    });
  }
};

// Verify email OTP
module.exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;

  // Check whether signup verification was initiated
  const pendingSignup = req.session.pendingSignup;
  const email = req.body.email?.trim().toLowerCase();

  if (!pendingSignup) {
    return res.status(400).json({
      message: "Please enter your username and email first.",
    });
  }
  if (email !== pendingSignup.email) {
    return res.status(400).json({
      message: "Email does not match the verification request.",
    });
  }

  // Validate OTP format
  if (!/^\d{6}$/.test(otp || "")) {
    return res.status(400).json({
      message: "Please enter a valid 6-digit OTP.",
    });
  }

  // Check OTP expiration
  if (Date.now() > pendingSignup.verificationCodeExpires) {
    delete req.session.pendingSignup;

    return res.status(400).json({
      message: "Your OTP has expired. Please start again.",
    });
  }

  // Compare submitted OTP with stored OTP hash
  const submittedOTPHash = hashOTP(otp);

  if (submittedOTPHash !== pendingSignup.verificationCodeHash) {
    return res.status(400).json({
      message: "Incorrect OTP. Please try again.",
    });
  }

  // Mark email as verified in the temporary session
  pendingSignup.isEmailVerified = true;

  return res.json({
    message: "Email verified successfully!",
  });
};

// for dispalying the login form
module.exports.loginGet = (req, res) => {
  res.render("./users/login.ejs");
};

// for the actual login thourgh backend
module.exports.loginPost = async (req, res) => {
  let redirectUrl = res.locals.redirectUrl || "/listings";
  req.flash("success", `Welcome back to WanderLust ${req.user.username}.`);
  res.redirect(redirectUrl);
};

// for logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
