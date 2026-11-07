// 1. GET HTML ELEMENTS

// Get the check-in and check-out date inputs
const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");

// Get the element that displays the total stay duration
const stayDuration = document.getElementById("stayDuration");

// Get the availability button and result message
const checkAvailabilityBtn = document.getElementById("checkAvailabilityBtn");
const availabilityResult = document.getElementById("availabilityResult");

// Get the Continue button
const continueBtn = document.getElementById("continueToPricingBtn");

// Get validation feedback elements
const checkInFeedback = document.getElementById("checkInFeedback");
const checkOutFeedback = document.getElementById("checkOutFeedback");

// Get the selected listing ID from the EJS page
const listingId = document.querySelector(".booking-container").dataset.listingId;

// 2. BOOKING STATE

// Track whether the selected dates are available
let isAvailable = false;

// 3. INITIALIZE CHECK-IN CALENDAR

const checkInPicker = flatpickr(checkInInput, {
  defaultDate: checkInInput.value || null,
  // Store the selected date in YYYY-MM-DD format
  dateFormat: "Y-m-d",

  // Users cannot select past dates
  minDate: "today",

  // Use Flatpickr calendar on mobile devices
  disableMobile: true,

  // Prevent manual date entry
  allowInput: false,

  onChange: function (selectedDates) {
    // Get the selected check-in date
    const selectedDate = selectedDates[0];

    if (!selectedDate) return;

    // Check-out must be at least one day after check-in
    const nextDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + 1,
    );

    // Update the minimum selectable check-out date
    checkOutPicker.set("minDate", nextDay);

    // Get the currently selected check-out date
    const checkoutDate = checkOutPicker.selectedDates[0];

    // Clear check-out if it is no longer valid
    if (checkoutDate && checkoutDate <= selectedDate) {
      checkOutPicker.clear();
    }

    // Reset availability because the dates have changed
    resetAvailability();

    // Calculate the updated stay duration
    calculateStayDuration();
  },
});

// 4. INITIALIZE CHECK-OUT CALENDAR

const checkOutPicker = flatpickr(checkOutInput, {
  defaultDate: checkOutInput.value || null,
  dateFormat: "Y-m-d",

  // Initially, check-out must be at least tomorrow
  minDate: new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1,
  ),

  disableMobile: true,
  allowInput: false,

  onChange: function () {
    // Reset availability whenever check-out changes
    resetAvailability();

    // Calculate the updated stay duration
    calculateStayDuration();
  },
});

// 5. CALCULATE NUMBER OF NIGHTS

function calculateStayDuration() {
  // Get the selected check-in and check-out dates
  const checkInDate = checkInPicker.selectedDates[0];
  const checkOutDate = checkOutPicker.selectedDates[0];

  // If either date is missing, show the default message
  if (!checkInDate || !checkOutDate) {
    stayDuration.textContent = "Select your dates";
    return;
  }

  // Convert dates to UTC to avoid daylight-saving calculation issues
  const checkInUTC = Date.UTC(
    checkInDate.getFullYear(),
    checkInDate.getMonth(),
    checkInDate.getDate(),
  );

  const checkOutUTC = Date.UTC(
    checkOutDate.getFullYear(),
    checkOutDate.getMonth(),
    checkOutDate.getDate(),
  );

  // Calculate the number of nights
  const nights = Math.round((checkOutUTC - checkInUTC) / (1000 * 60 * 60 * 24));

  // Display the number of nights
  if (nights > 0) {
    stayDuration.textContent = `${nights} ${nights === 1 ? "night" : "nights"}`;
  } else {
    stayDuration.textContent = "Select valid dates";
  }
}

// 6. RESET AVAILABILITY WHEN DATES CHANGE

function resetAvailability() {
  // Mark the selected dates as not yet checked
  isAvailable = false;

  // Disable the Continue button until availability is checked again
  continueBtn.disabled = true;

  // Clear the previous availability message
  availabilityResult.textContent = "";

  availabilityResult.className = "availability-result";

  // Restore the original availability button
  checkAvailabilityBtn.disabled = false;

  checkAvailabilityBtn.innerHTML =
    '<i class="fa-solid fa-magnifying-glass"></i> Check Availability';
}

// 7. VALIDATE SELECTED DATES

function validateDates() {
  // Get the selected dates
  const checkInDate = checkInPicker.selectedDates[0];
  const checkOutDate = checkOutPicker.selectedDates[0];

  let isValid = true;

  // Clear previous validation messages
  checkInFeedback.classList.remove("show");
  checkOutFeedback.classList.remove("show");

  checkInInput.classList.remove("is-invalid");
  checkOutInput.classList.remove("is-invalid");

  // Check whether check-in date is selected
  if (!checkInDate) {
    checkInInput.classList.add("is-invalid");
    checkInFeedback.classList.add("show");

    isValid = false;
  }

  // Check whether check-out date is selected
  if (!checkOutDate) {
    checkOutInput.classList.add("is-invalid");
    checkOutFeedback.textContent = "Please select a check-out date.";

    checkOutFeedback.classList.add("show");

    isValid = false;
  }

  // Check whether check-out is after check-in
  if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
    checkOutInput.classList.add("is-invalid");

    checkOutFeedback.textContent = "Check-out must be after check-in.";

    checkOutFeedback.classList.add("show");

    isValid = false;
  }

  return isValid;
}

// 8. CHECK AVAILABILITY

checkAvailabilityBtn.addEventListener("click", function () {

    // Validate the selected dates
    if (!validateDates()) {
        return;
    }

    // Show loading state
    checkAvailabilityBtn.disabled = true;

    checkAvailabilityBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Checking...';

    // Simulate availability checking
    setTimeout(function () {

        
        // Mark dates as available
        isAvailable = true;

        sessionStorage.setItem("availableDates", JSON.stringify({
          checkIn: checkInInput.value,
          checkOut: checkOutInput.value
        }));

        // Display availability message
        availabilityResult.textContent =
            "Great! This property is available for your selected dates.";

        availabilityResult.className =
            "availability-result success";

        // Enable Continue button
        continueBtn.disabled = false;

        // Restore availability button
        checkAvailabilityBtn.disabled = false;

        checkAvailabilityBtn.innerHTML =
            '<i class="fa-solid fa-check"></i> Check Again';

        // Store dates temporarily in sessionStorage
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;

        const nights = Math.round(
            (new Date(`${checkOut}T00:00:00Z`) -
             new Date(`${checkIn}T00:00:00Z`)) /
            (1000 * 60 * 60 * 24)
        );

    }, 800);
});


// 9. CONTINUE TO PRICING

continueBtn.addEventListener("click", async function () {

    // Do not continue unless availability has been checked
    if (!isAvailable) {
        return;
    }

    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;

    try {
        continueBtn.disabled = true;
        continueBtn.textContent = "Saving...";

        const response = await fetch(
            `/listings/${listingId}/book/stay-details`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    checkIn,
                    checkOut
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to save stay details."
            );
        }

        window.location.href = result.redirectUrl;

    } catch (error) {

        availabilityResult.textContent = error.message;
        availabilityResult.className = "availability-result error";

        continueBtn.disabled = false;
        continueBtn.textContent = "Continue";
    }
});

// 10. BACK TO GUEST DETAILS

// 11. RESTORE SAVED BOOKING DETAILS

const bookingContainer = document.querySelector(".booking-container");

const availabilityChecked =
    bookingContainer.dataset.availabilityChecked === "true";

// Restore the stay duration
calculateStayDuration();

// Restore availability if dates were previously saved
if (
    availabilityChecked &&
    checkInPicker.selectedDates.length > 0 &&
    checkOutPicker.selectedDates.length > 0
) {
    // Mark availability as checked
    isAvailable = true;

    // Enable Continue button
    continueBtn.disabled = false;
    continueBtn.textContent = "Continue";

    // Restore availability message
    availabilityResult.textContent =
        "Great! This property is available for your selected dates.";

    availabilityResult.className = "availability-result success";

    // Restore availability button
    checkAvailabilityBtn.disabled = false;

    checkAvailabilityBtn.innerHTML =
        '<i class="fa-solid fa-check"></i> Check Again';

    // Update minimum check-out date
    const selectedCheckIn = checkInPicker.selectedDates[0];

    const nextDay = new Date(
        selectedCheckIn.getFullYear(),
        selectedCheckIn.getMonth(),
        selectedCheckIn.getDate() + 1
    );

    checkOutPicker.set("minDate", nextDay);
}