// =========================================
// WANDERLUST - GUEST DETAILS FUNCTIONALITY
// =========================================

// GET HTML ELEMENTS

const guestDetailsForm = document.getElementById("guestDetailsForm");

const dateOfBirth = document.getElementById("dateOfBirth");
const ageInput = document.getElementById("age");

const mobileNumber = document.getElementById("mobileNumber");

const sex = document.getElementById("sex");

const mobileFeedback = document.getElementById("mobileFeedback");
const dobFeedback = document.getElementById("dobFeedback");
const sexFeedback = document.getElementById("sexFeedback");
const fullName = document.getElementById("fullName");
const fullNameFeedback = document.getElementById("fullNameFeedback");

// TRACK WHETHER THE USER HAS ATTEMPTED SUBMISSION

let formSubmitted = false;

// =========================================
// VALIDATE FULL NAME
// =========================================

function validateFullName() {
  const name = fullName.value.trim();

  const namePattern = /^[a-zA-Z]+(?:[ '-][a-zA-Z]+)*$/;

  if (name.length < 2 || !namePattern.test(name)) {
    fullName.classList.add("is-invalid");
    fullName.classList.remove("is-valid");

    fullNameFeedback.classList.add("show");

    return false;
  }

  fullName.classList.remove("is-invalid");
  fullName.classList.add("is-valid");

  fullNameFeedback.classList.remove("show");

  return true;
}

// =========================================
// 1. MODERN DATE PICKER
// =========================================

const datePicker = flatpickr(dateOfBirth, {
  dateFormat: "Y-m-d",

  altInput: true,
  altFormat: "F j, Y",
  altInputClass: "form-control",

  maxDate: "today",

  disableMobile: true,
  allowInput: false,

  onChange: function (selectedDates) {
    if (selectedDates.length > 0) {
      const age = calculateAge(selectedDates[0]);

      ageInput.value = age + " years";

      dateOfBirth.classList.remove("is-invalid");

      dobFeedback.classList.remove("show");
    } else {
      ageInput.value = "";
    }

    if (formSubmitted) {
      validateDateOfBirth();
    }
  },
});

// GET THE VISIBLE FLATPICKR INPUT

const visibleDateInput = datePicker.altInput;

// =========================================
// 2. CALCULATE AGE AUTOMATICALLY
// =========================================

function calculateAge(birthDate) {
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

// =========================================
// 3. VALIDATE DATE OF BIRTH
// =========================================

function validateDateOfBirth() {
  const selectedDate = dateOfBirth.value;

  if (!selectedDate) {
    visibleDateInput.classList.add("is-invalid");
    visibleDateInput.classList.remove("is-valid");

    dobFeedback.textContent = "Please select your date of birth.";

    dobFeedback.classList.add("show");

    return false;
  }

  const birthDate = datePicker.selectedDates[0];

  if (!birthDate || birthDate > new Date()) {
    visibleDateInput.classList.add("is-invalid");
    visibleDateInput.classList.remove("is-valid");

    dobFeedback.textContent = "Please select a valid date of birth.";

    dobFeedback.classList.add("show");

    return false;
  }

  visibleDateInput.classList.remove("is-invalid");
  visibleDateInput.classList.add("is-valid");

  dobFeedback.classList.remove("show");

  return true;
}

// =========================================
// 4. VALIDATE MOBILE NUMBER
// =========================================

function validateMobileNumber() {
  const phone = mobileNumber.value.trim();

  const phonePattern = /^[0-9]{10}$/;

  if (!phonePattern.test(phone)) {
    mobileNumber.classList.add("is-invalid");
    mobileNumber.classList.remove("is-valid");

    mobileFeedback.textContent =
      "Please enter a valid mobile number (10 digits).";

    mobileFeedback.classList.add("show");

    return false;
  }

  mobileNumber.classList.remove("is-invalid");
  mobileNumber.classList.add("is-valid");

  mobileFeedback.classList.remove("show");

  return true;
}

// =========================================
// 6. VALIDATE SEX
// =========================================

function validateSex() {
  if (!sex.value) {
    sex.classList.add("is-invalid");
    sex.classList.remove("is-valid");

    sexFeedback.classList.add("show");

    return false;
  }

  sex.classList.remove("is-invalid");
  sex.classList.add("is-valid");

  sexFeedback.classList.remove("show");

  return true;
}

// =========================================
// 7. LIVE VALIDATION
// =========================================

// FULL NAME

fullName.addEventListener("input", function () {
  if (formSubmitted) {
    validateFullName();
  }
});

// MOBILE NUMBER

mobileNumber.addEventListener("input", function () {
  if (formSubmitted) {
    validateMobileNumber();
  }
});

// SEX

sex.addEventListener("change", function () {
  if (formSubmitted) {
    validateSex();
  }
});

// =========================================
// 8. FORM SUBMISSION
// =========================================

// Listen for the form submission
guestDetailsForm.addEventListener("submit", async function (event) {
  // Prevent the browser from submitting the form normally
  // We will handle the submission using JavaScript and fetch()
  event.preventDefault();

  // Track that the user has attempted to submit the form
  // This enables live validation when the user corrects their inputs
  formSubmitted = true;

  // =====================================
  // VALIDATE ALL REQUIRED FIELDS
  // =====================================

  // Call each validation function
  const isNameValid = validateFullName();
  const isMobileValid = validateMobileNumber();
  const isDateValid = validateDateOfBirth();
  const isSexValid = validateSex();

  // Check whether all fields are valid
  // The form can continue only when every validation returns true
  const isFormValid = isNameValid && isMobileValid && isDateValid && isSexValid;

  // =====================================
  // HANDLE FRONTEND VALIDATION ERRORS
  // =====================================

  // If any field is invalid, stop the submission
  if (!isFormValid) {
    event.stopPropagation();

    // Focus the first field that contains an error
    // This helps the user identify what needs to be corrected

    if (!isNameValid) {
      fullName.focus();
    } else if (!isMobileValid) {
      mobileNumber.focus();
    } else if (!isDateValid) {
      visibleDateInput.focus();
    } else if (!isSexValid) {
      sex.focus();
    }

    return;
  }

  // =====================================
  // SEND GUEST DETAILS TO BACKEND
  // =====================================

  // Get the Continue button
  const continueBtn = document.getElementById("continueBtn");

  try {
    // Disable the button to prevent multiple submissions
    // Change its text to indicate that the data is being saved
    continueBtn.disabled = true;
    continueBtn.textContent = "Saving details...";

    // Collect all form values
    // URLSearchParams converts the form data into
    // URL-encoded format that Express can read using
    // express.urlencoded({ extended: true })
    const formData = new URLSearchParams(new FormData(guestDetailsForm));

    // Send the guest details to the POST route
    // The route is taken from the form's action attribute
    const response = await fetch(guestDetailsForm.action, {
      // Specify that we are sending data using POST
      method: "POST",

      // Attach the collected form data
      body: formData,

      // Tell the server that we expect a JSON response
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Convert the server's JSON response into a JavaScript object
    const result = await response.json();

    // =====================================
    // HANDLE BACKEND RESPONSE
    // =====================================

    // Check whether the server returned an error
    // For example, Joi validation may reject the submitted data
    if (!response.ok) {
      throw new Error(result.message || "Unable to save guest details.");
    }

    // Redirect to Stay Details after successful session storage
    window.location.href = result.redirectUrl;
    return;

    // If the response is successful:
    // Guest details have been validated by the backend
    // and stored in req.session.booking.
  } catch (error) {
    console.error("Booking error:", error);
    alert(error.message || "Something went wrong. Please try again.");
  } finally {
    // Restore the button only if the page is still active
    if (document.visibilityState === "visible") {
        continueBtn.disabled = false;
        continueBtn.textContent = "Continue to Stay Details";
    }
}
});
