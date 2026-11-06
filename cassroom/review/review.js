
// =========================================
// GET HTML ELEMENTS
// =========================================

const reviewFullName = document.getElementById("reviewFullName");
const reviewEmail = document.getElementById("reviewEmail");
const reviewMobile = document.getElementById("reviewMobile");
const reviewDOB = document.getElementById("reviewDOB");
const reviewAge = document.getElementById("reviewAge");
const reviewSex = document.getElementById("reviewSex");

const reviewCheckIn = document.getElementById("reviewCheckIn");
const reviewCheckOut = document.getElementById("reviewCheckOut");
const reviewNights = document.getElementById("reviewNights");

const reviewAccommodation = document.getElementById("reviewAccommodation");
const reviewPlatformFee = document.getElementById("reviewPlatformFee");
const reviewTax = document.getElementById("reviewTax");
const reviewTotal = document.getElementById("reviewTotal");

const confirmBookingBtn = document.getElementById("confirmBookingBtn");

const reviewLayout = document.getElementById("reviewLayout");
const bookingSuccess = document.getElementById("bookingSuccess");


// =========================================
// FORMAT CURRENCY
// =========================================

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);

}


// =========================================
// FORMAT DATE
// =========================================

function formatDate(dateString) {

    if (!dateString) return "--";

    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}


// =========================================
// GET GUEST DETAILS
// =========================================

// The guest details page can save all fields
// together as a guestDetails object.

const guestDetails = JSON.parse(
    sessionStorage.getItem("guestDetails") || "{}"
);

// Also support individual sessionStorage values.

const fullName =
    guestDetails.fullName ||
    sessionStorage.getItem("fullName");

const email =
    guestDetails.email ||
    sessionStorage.getItem("email");

const countryCode =
    guestDetails.countryCode ||
    sessionStorage.getItem("countryCode");

const mobileNumber =
    guestDetails.mobileNumber ||
    sessionStorage.getItem("mobileNumber");

const dateOfBirth =
    guestDetails.dateOfBirth ||
    sessionStorage.getItem("dateOfBirth");

const age =
    guestDetails.age ||
    sessionStorage.getItem("age");

const sex =
    guestDetails.sex ||
    sessionStorage.getItem("sex");


// =========================================
// DISPLAY GUEST DETAILS
// =========================================

function displayGuestDetails() {

    reviewFullName.textContent = fullName || "Not available";

    reviewEmail.textContent = email || "Not available";

    reviewMobile.textContent =
        countryCode && mobileNumber
            ? `${countryCode} ${mobileNumber}`
            : mobileNumber || "Not available";

    reviewDOB.textContent =
        dateOfBirth ? formatDate(dateOfBirth) : "Not available";

    reviewAge.textContent =
        age ? `${age} years` : "Not available";

    const sexLabels = {
        male: "Male",
        female: "Female",
        other: "Other",
        prefer_not_to_say: "Prefer not to say"
    };

    reviewSex.textContent =
        sexLabels[sex] || sex || "Not available";

}


// =========================================
// GET STAY DETAILS
// =========================================

const checkIn = sessionStorage.getItem("checkIn");
const checkOut = sessionStorage.getItem("checkOut");

const savedNights = sessionStorage.getItem("nights");


// =========================================
// DISPLAY STAY DETAILS
// =========================================

function displayStayDetails() {

    if (!checkIn || !checkOut) {

        reviewCheckIn.textContent = "Not selected";
        reviewCheckOut.textContent = "Not selected";
        reviewNights.textContent = "Not available";

        return false;

    }

    const [inYear, inMonth, inDay] = checkIn.split("-").map(Number);
    const [outYear, outMonth, outDay] = checkOut.split("-").map(Number);

    const checkInUTC = Date.UTC(inYear, inMonth - 1, inDay);
    const checkOutUTC = Date.UTC(outYear, outMonth - 1, outDay);

    const calculatedNights = Math.round(
        (checkOutUTC - checkInUTC) / (1000 * 60 * 60 * 24)
    );

    if (calculatedNights <= 0) {
        reviewCheckIn.textContent = "Invalid dates";
        reviewCheckOut.textContent = "Invalid dates";
        reviewNights.textContent = "Invalid duration";
        return false;
    }

    reviewCheckIn.textContent = formatDate(checkIn);
    reviewCheckOut.textContent = formatDate(checkOut);

    const nights = Number(savedNights) || calculatedNights;

    reviewNights.textContent =
        `${nights} ${nights === 1 ? "night" : "nights"}`;

    return true;

}


// =========================================
// GET PRICING DETAILS
// =========================================

const savedPricing = sessionStorage.getItem("pricingDetails");

const pricingDetails = savedPricing
    ? JSON.parse(savedPricing)
    : null;


// =========================================
// DISPLAY PRICE DETAILS
// =========================================

function displayPricingDetails() {

    if (!pricingDetails) {

        reviewAccommodation.textContent = "Not available";
        reviewPlatformFee.textContent = "Not available";
        reviewTax.textContent = "Not available";
        reviewTotal.textContent = "Not available";

        return false;

    }

    const {
        accommodationPrice,
        platformFee,
        taxAmount,
        totalPrice
    } = pricingDetails;

    // Validate saved pricing values

    const amounts = [
        accommodationPrice,
        platformFee,
        taxAmount,
        totalPrice
    ];

    const validAmounts = amounts.every(
        amount => Number.isFinite(amount) && amount >= 0
    );

    if (!validAmounts || totalPrice <= 0) {
        return false;
    }

    reviewAccommodation.textContent =
        formatCurrency(accommodationPrice);

    reviewPlatformFee.textContent =
        formatCurrency(platformFee);

    reviewTax.textContent =
        formatCurrency(taxAmount);

    reviewTotal.textContent =
        formatCurrency(totalPrice);

    return true;

}


// =========================================
// ENABLE OR DISABLE CONFIRMATION
// =========================================

function initializeReviewPage() {

    displayGuestDetails();

    const validStay = displayStayDetails();

    const validPricing = displayPricingDetails();

    confirmBookingBtn.disabled = !(validStay && validPricing);

}


// =========================================
// GENERATE BOOKING REFERENCE
// =========================================

function generateBookingReference() {

    const randomNumber = Math.floor(
        100000 + Math.random() * 900000
    );

    return `WL-${randomNumber}`;

}


// =========================================
// CONFIRM BOOKING
// =========================================

confirmBookingBtn.addEventListener("click", function () {

    if (confirmBookingBtn.disabled) return;

    const bookingReference = generateBookingReference();

    // Save frontend demonstration confirmation

    const bookingConfirmation = {
        bookingReference,
        guestDetails,
        checkIn,
        checkOut,
        pricingDetails,
        status: "Confirmed"
    };

    sessionStorage.setItem(
        "bookingConfirmation",
        JSON.stringify(bookingConfirmation)
    );

    // Display success screen

    document.getElementById("bookingReference").textContent =
        bookingReference;

    document.getElementById("successNights").textContent =
        `${pricingDetails.nights} ${
            pricingDetails.nights === 1 ? "night" : "nights"
        }`;

    document.getElementById("successTotal").textContent =
        formatCurrency(pricingDetails.totalPrice);

    reviewLayout.hidden = true;

    bookingSuccess.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// =========================================
// INITIALIZE REVIEW PAGE
// =========================================

initializeReviewPage();
