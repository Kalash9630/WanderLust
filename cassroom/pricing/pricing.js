
// =========================================
// GET HTML ELEMENTS
// =========================================

const checkInDateElement = document.getElementById("checkInDate");
const checkOutDateElement = document.getElementById("checkOutDate");
const numberOfNightsElement = document.getElementById("numberOfNights");

const nightlyCalculation = document.getElementById("nightlyCalculation");

const accommodationPriceElement = document.getElementById("accommodationPrice");
const platformFeeElement = document.getElementById("platformFee");
const taxAmountElement = document.getElementById("taxAmount");
const totalPriceElement = document.getElementById("totalPrice");

const continueBtn = document.getElementById("continueToReviewBtn");


// =========================================
// PRICING CONFIGURATION
// =========================================

// Sample prices for frontend testing

const nightlyPrice = 5000;

const platformFeeRate = 0.02;
const taxRate = 0.05;


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

    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}


// =========================================
// GET SAVED STAY DETAILS
// =========================================

const checkIn = sessionStorage.getItem("checkIn");
const checkOut = sessionStorage.getItem("checkOut");


// =========================================
// CALCULATE NUMBER OF NIGHTS
// =========================================

function calculateNights(checkIn, checkOut) {

    const [inYear, inMonth, inDay] = checkIn.split("-").map(Number);
    const [outYear, outMonth, outDay] = checkOut.split("-").map(Number);

    const checkInUTC = Date.UTC(inYear, inMonth - 1, inDay);
    const checkOutUTC = Date.UTC(outYear, outMonth - 1, outDay);

    return Math.round(
        (checkOutUTC - checkInUTC) / (1000 * 60 * 60 * 24)
    );

}


// =========================================
// CALCULATE AND DISPLAY PRICING
// =========================================

function calculatePricing() {

    // Check whether stay dates exist

    if (!checkIn || !checkOut) {

        checkInDateElement.textContent = "Not selected";
        checkOutDateElement.textContent = "Not selected";
        numberOfNightsElement.textContent = "--";

        nightlyCalculation.textContent = "Stay dates required";

        continueBtn.disabled = true;

        return;

    }


    // Calculate nights

    const nights = calculateNights(checkIn, checkOut);


    if (nights <= 0) {

        checkInDateElement.textContent = "Invalid dates";
        checkOutDateElement.textContent = "Invalid dates";
        numberOfNightsElement.textContent = "--";

        nightlyCalculation.textContent = "Please select valid dates";

        continueBtn.disabled = true;

        return;

    }


    // Display selected dates

    checkInDateElement.textContent = formatDate(checkIn);
    checkOutDateElement.textContent = formatDate(checkOut);

    numberOfNightsElement.textContent =
        `${nights} ${nights === 1 ? "night" : "nights"}`;


    // Calculate accommodation amount

    const accommodationPrice = nightlyPrice * nights;


    // Calculate platform fee (2%)

    const platformFee = accommodationPrice * platformFeeRate;


    // Calculate taxes (5% of accommodation)

    const taxAmount = accommodationPrice * taxRate;


    // Calculate final amount

    const totalPrice =
        accommodationPrice + platformFee + taxAmount;


    // Display price breakdown

    nightlyCalculation.textContent =
        `${formatCurrency(nightlyPrice)} × ${nights} ${nights === 1 ? "night" : "nights"}`;

    accommodationPriceElement.textContent =
        formatCurrency(accommodationPrice);

    platformFeeElement.textContent =
        formatCurrency(platformFee);

    taxAmountElement.textContent =
        formatCurrency(taxAmount);

    totalPriceElement.textContent =
        formatCurrency(totalPrice);


    // Save pricing information for the next page

    const pricingDetails = {
        nights,
        nightlyPrice,
        accommodationPrice,
        platformFee,
        taxAmount,
        totalPrice
    };

    sessionStorage.setItem(
        "pricingDetails",
        JSON.stringify(pricingDetails)
    );


    // Enable Continue button

    continueBtn.disabled = false;

}


// =========================================
// CONTINUE TO REVIEW PAGE
// =========================================

continueBtn.addEventListener("click", function () {

    const savedPricing = sessionStorage.getItem("pricingDetails");

    if (!savedPricing) {
        return;
    }

    window.location.href = "review.html";

});


// =========================================
// INITIALIZE PRICING PAGE
// =========================================

calculatePricing();
