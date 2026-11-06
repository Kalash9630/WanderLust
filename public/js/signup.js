const signupForm = document.getElementById("signupForm");
if (signupForm) {
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const otpInput = document.getElementById("otp");
  const passwordInput = document.getElementById("password");

  const usernameMessage = document.getElementById("usernameMessage");
  const emailMessage = document.getElementById("emailMessage");
  const otpMessage = document.getElementById("otpMessage");

  const sendOtpButton = document.getElementById("sendOtpButton");
  const verifyOtpButton = document.getElementById("verifyOtpButton");

  const otpSection = document.getElementById("otpSection");
  const passwordSection = document.getElementById("passwordSection");
  const signupButton = document.getElementById("signupButton");
  const emailVerifiedMessage = document.getElementById("emailVerifiedMessage");

  let usernameAvailable = false;
  let otpVerified = false;
  let usernameTimer;

  // STEP 1: CHECK USERNAME AVAILABILITY

  usernameInput.addEventListener("input", function () {
    clearTimeout(usernameTimer);

    usernameAvailable = false;
    emailInput.disabled = true;
    sendOtpButton.disabled = true;

    usernameMessage.textContent = "";
    usernameMessage.style.color = "";

    usernameTimer = setTimeout(async function () {
      const username = usernameInput.value.trim();

      if (username.length < 3) {
        usernameMessage.textContent =
          "Username must contain at least 3 characters.";
        usernameMessage.style.color = "red";
        return;
      }

      try {
        const response = await fetch(
          `/check-username?username=${encodeURIComponent(username)}`,
        );

        const data = await response.json();

        if (data.available) {
          usernameAvailable = true;

          usernameMessage.textContent = "Username is available!";
          usernameMessage.style.color = "green";

          emailInput.disabled = false;
        } else {
          usernameMessage.textContent =
            "Username is already taken. Enter other username";
          usernameMessage.style.color = "red";
        }
      } catch (error) {
        usernameMessage.textContent = "Unable to check username. Try again.";
        usernameMessage.style.color = "red";
      }
    }, 500);
  });

  // STEP 2: ENABLE OTP BUTTON WHEN EMAIL IS VALID

  emailInput.addEventListener("input", function () {
    otpSection.style.display = "none";
    passwordSection.style.display = "none";
    signupButton.style.display = "none";

    otpVerified = false;
    otpInput.value = "";
    passwordInput.value = "";
    passwordInput.disabled = true;

    emailMessage.textContent = "";
    otpMessage.textContent = "";

    sendOtpButton.disabled = !usernameAvailable || !emailInput.validity.valid;
  });

  // STEP 3: SEND OTP TO EMAIL

  sendOtpButton.addEventListener("click", async function () {
    sendOtpButton.disabled = true;
    sendOtpButton.textContent = "Sending...";

    try {
      const response = await fetch("/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput.value.trim(),
          email: emailInput.value.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        emailMessage.textContent = data.message;
        emailMessage.style.color = "green";

        otpSection.style.display = "block";
      } else {
        emailMessage.textContent = data.message;
        emailMessage.style.color = "red";
      }
    } catch (error) {
      emailMessage.textContent = "Unable to send verification code.";
      emailMessage.style.color = "red";
    }

    sendOtpButton.textContent = "Send Verification Code";
    sendOtpButton.disabled = false;
  });

  // STEP 4: VERIFY OTP

  verifyOtpButton.addEventListener("click", async function () {
    verifyOtpButton.disabled = true;
    verifyOtpButton.textContent = "Verifying...";

    try {
      const response = await fetch("/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput.value.trim(),
          otp: otpInput.value.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        otpVerified = true;

        // Hide OTP section and send OTP button
        otpSection.style.display = "none";
        sendOtpButton.style.display = "none";

        // Make username and email read-only
        usernameInput.readOnly = true;
        emailInput.readOnly = true;

        // Display email verified message
        emailVerifiedMessage.style.display = "block";

        // Show password field
        passwordSection.style.display = "block";
        passwordInput.disabled = false;
        passwordInput.required = true;

        // Show Create Account button
        signupButton.style.display = "block";
        signupButton.disabled = false;

        // Remove the OTP sent success message
        emailMessage.textContent = "";
        emailMessage.style.display = "none";

        // Display email verified message
        emailVerifiedMessage.textContent = "✓ Email verified";
        emailVerifiedMessage.style.display = "block";
        emailVerifiedMessage.style.color = "green";
      } else {
        otpMessage.textContent = data.message;
        otpMessage.style.color = "red";
      }
    } catch (error) {
      otpMessage.textContent = "Unable to verify OTP. Try again.";
      otpMessage.style.color = "red";
    }

    verifyOtpButton.disabled = false;
    verifyOtpButton.textContent = "Verify Email";
  });

  // STEP 5: FINAL SIGNUP VALIDATION

  signupForm.addEventListener("submit", function (event) {
    if (!usernameAvailable || !otpVerified || !passwordInput.value) {
      event.preventDefault();

      if (!usernameAvailable) {
        usernameMessage.textContent = "Please choose an available username.";
        usernameMessage.style.color = "red";
      }

      if (!otpVerified) {
        otpMessage.textContent = "Please verify your email first.";
        otpMessage.style.color = "red";
      }

      if (passwordInput.value.length < 3) {
        event.preventDefault();

        const passwordMessage = document.getElementById("passwordMessage");

        passwordMessage.textContent =
          "Password must contain at least 3 characters.";

        passwordInput.focus();
        return;
      }

      return;
    }
  });

  passwordInput.addEventListener("input", function () {
    document.getElementById("passwordMessage").textContent = "";
  });

  if (signupForm.dataset.verifiedSignup === "true") {
    usernameAvailable = true;
    otpVerified = true;

    usernameInput.value = signupForm.dataset.username;
    emailInput.value = signupForm.dataset.email;

    usernameInput.readOnly = true;
    emailInput.readOnly = true;

    emailInput.disabled = false;

    emailVerifiedMessage.style.display = "block";
    emailMessage.style.display = "none";

    sendOtpButton.style.display = "none";
    otpSection.style.display = "none";

    passwordSection.style.display = "block";
    passwordInput.disabled = false;
    passwordInput.required = true;

    signupButton.style.display = "block";
    signupButton.disabled = false;
  }
}
