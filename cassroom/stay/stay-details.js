
// =========================================
// GET HTML ELEMENTS
// =========================================

const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");

const stayDuration = document.getElementById("stayDuration");

const checkAvailabilityBtn = document.getElementById("checkAvailabilityBtn");
const availabilityResult = document.getElementById("availabilityResult");

const continueBtn = document.getElementById("continueToPricingBtn");

const checkInFeedback = document.getElementById("checkInFeedback");
const checkOutFeedback = document.getElementById("checkOutFeedback");


// =========================================
// BOOKING STATE
// =========================================

let isAvailable = false;


// =========================================
// INITIALIZE CHECK-IN CALENDAR
// =========================================

const checkInPicker = flatpickr(checkInInput, {
    dateFormat: "Y-m-d",
    minDate: "today",
    disableMobile: true,
    allowInput: false,

    onChange: function (selectedDates) {

        const selectedDate = selectedDates[0];

        if (!selectedDate) return;

        // Check-out must be at least one day after check-in
        const nextDay = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate() + 1
        );

        checkOutPicker.set("minDate", nextDay);

        // Clear checkout if it is no longer valid
        const checkoutDate = checkOutPicker.selectedDates[0];

        if (checkoutDate && checkoutDate <= selectedDate) {
            checkOutPicker.clear();
        }

        resetAvailability();
        calculateStayDuration();
    }
});


// =========================================
// INITIALIZE CHECK-OUT CALENDAR
// =========================================

const checkOutPicker = flatpickr(checkOutInput, {
    dateFormat: "Y-m-d",
    minDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
    ),
    disableMobile: true,
    allowInput: false,

    onChange: function () {
        resetAvailability();
        calculateStayDuration();
    }
});


// =========================================
// CALCULATE NUMBER OF NIGHTS
// =========================================

function calculateStayDuration() {

    const checkInDate = checkInPicker.selectedDates[0];
    const checkOutDate = checkOutPicker.selectedDates[0];

    if (!checkInDate || !checkOutDate) {
        stayDuration.textContent = "Select your dates";
        return;
    }

    // Convert dates to UTC to avoid daylight-saving calculation issues
    const checkInUTC = Date.UTC(
        checkInDate.getFullYear(),
        checkInDate.getMonth(),
        checkInDate.getDate()
    );

    const checkOutUTC = Date.UTC(
        checkOutDate.getFullYear(),
        checkOutDate.getMonth(),
        checkOutDate.getDate()
    );

    const nights = Math.round(
        (checkOutUTC - checkInUTC) / (1000 * 60 * 60 * 24)
    );

    if (nights > 0) {
        stayDuration.textContent =
            `${nights} ${nights === 1 ? "night" : "nights"}`;
    } else {
        stayDuration.textContent = "Select valid dates";
    }
}


// =========================================
// RESET AVAILABILITY WHEN DATES CHANGE
// =========================================

function resetAvailability() {

    isAvailable = false;

    continueBtn.disabled = true;

    availabilityResult.textContent = "";
    availabilityResult.className = "availability-result";
}


// =========================================
// VALIDATE SELECTED DATES
// =========================================

function validateDates() {

    const checkInDate = checkInPicker.selectedDates[0];
    const checkOutDate = checkOutPicker.selectedDates[0];

    let isValid = true;

    checkInFeedback.classList.remove("show");
    checkOutFeedback.classList.remove("show");

    checkInInput.classList.remove("is-invalid");
    checkOutInput.classList.remove("is-invalid");

    if (!checkInDate) {
        checkInInput.classList.add("is-invalid");
        checkInFeedback.classList.add("show");
        isValid = false;
    }

    if (!checkOutDate) {
        checkOutInput.classList.add("is-invalid");
        checkOutFeedback.classList.add("show");
        isValid = false;
    }

    if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
        checkOutInput.classList.add("is-invalid");
        checkOutFeedback.textContent =
            "Check-out must be after check-in.";
        checkOutFeedback.classList.add("show");
        isValid = false;
    }

    return isValid;
}


// =========================================
// CHECK AVAILABILITY
// =========================================

checkAvailabilityBtn.addEventListener("click", function () {

    resetAvailability();

    if (!validateDates()) {
        return;
    }

    const checkInDate = checkInPicker.selectedDates[0];
    const checkOutDate = checkOutPicker.selectedDates[0];

    const nights = Math.round(
        (
            Date.UTC(
                checkOutDate.getFullYear(),
                checkOutDate.getMonth(),
                checkOutDate.getDate()
            ) -
            Date.UTC(
                checkInDate.getFullYear(),
                checkInDate.getMonth(),
                checkInDate.getDate()
            )
        ) / (1000 * 60 * 60 * 24)
    );

    // Frontend demonstration only.
    // Real availability will be checked using the backend later.

    checkAvailabilityBtn.disabled = true;
    checkAvailabilityBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Checking...';

    setTimeout(function () {

        isAvailable = true;

        availabilityResult.textContent =
            "Great! These dates are available for your selected stay.";

        availabilityResult.classList.add("success");

        continueBtn.disabled = false;

        checkAvailabilityBtn.disabled = false;
        checkAvailabilityBtn.innerHTML =
            '<i class="fa-solid fa-check"></i> Availability Checked';

        // Save stay details for the next booking page
        sessionStorage.setItem("checkIn", checkInPicker.input.value);
        sessionStorage.setItem("checkOut", checkOutPicker.input.value);
        sessionStorage.setItem("nights", nights);

    }, 800);

});


// =========================================
// CONTINUE TO PRICING PAGE
// =========================================

continueBtn.addEventListener("click", function () {

    if (!isAvailable) return;

    window.location.href = "../pricing/pricing.html";

});


// =========================================
// BACK TO GUEST DETAILS
// =========================================

// The Back link is handled by the href in HTML.
