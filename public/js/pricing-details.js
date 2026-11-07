 // 1. GET HTML ELEMENTS

const pricingPage = document.getElementById("pricingPage");

const checkInDateElement = document.getElementById("checkInDate");
const checkOutDateElement = document.getElementById("checkOutDate");
const numberOfNightsElement = document.getElementById("numberOfNights");

const nightlyCalculation = document.getElementById("nightlyCalculation");
const accommodationPriceElement = document.getElementById("accommodationPrice");
const platformFeeElement = document.getElementById("platformFee");
const taxAmountElement = document.getElementById("taxAmount");
const totalPriceElement = document.getElementById("totalPrice");

const continueBtn = document.getElementById("continueToReviewBtn");


// 2. GET BOOKING DETAILS FROM EJS

const listingId = pricingPage.dataset.listingId;

const nightlyPrice = Number(pricingPage.dataset.nightlyPrice);
const checkIn = pricingPage.dataset.checkIn;
const checkOut = pricingPage.dataset.checkOut;
const nights = Number(pricingPage.dataset.nights);


// 3. PRICING RATES

const platformFeeRate = 0.02;
const taxRate = 0.05;


// Store calculated pricing details
let pricingDetails = null;


// 4. FORMAT CURRENCY

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}


// 5. FORMAT DATE

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// 6. CALCULATE PRICING

function calculatePricing() {

    // Check whether valid booking details are available
    if (
        !checkIn ||
        !checkOut ||
        !Number.isFinite(nights) ||
        nights <= 0 ||
        !Number.isFinite(nightlyPrice) ||
        nightlyPrice < 0
    ) {
        checkInDateElement.textContent = "Not selected";
        checkOutDateElement.textContent = "Not selected";
        numberOfNightsElement.textContent = "--";

        nightlyCalculation.textContent = "Valid stay details required";

        continueBtn.classList.add("disabled");
        continueBtn.setAttribute("aria-disabled", "true");

        return;
    }

    // Display selected dates and duration
    checkInDateElement.textContent = formatDate(checkIn);
    checkOutDateElement.textContent = formatDate(checkOut);

    numberOfNightsElement.textContent =
        `${nights} ${nights === 1 ? "night" : "nights"}`;


    // Calculate accommodation price
    const accommodationPrice = nightlyPrice * nights;

    // Calculate platform fee (2%)
    const platformFee = accommodationPrice * platformFeeRate;

    // Calculate taxes (5%)
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


    // Store calculated values in JavaScript
    pricingDetails = {
        accommodationPrice,
        platformFee,
        taxAmount,
        totalPrice
    };

    // Enable Continue after successful calculation
    continueBtn.classList.add("disabled");
    continueBtn.setAttribute("aria-disabled", "true");
}


// 7. RUN PRICING CALCULATION

calculatePricing();


// 8. SAVE PRICING DETAILS AND CONTINUE

continueBtn.addEventListener("click", async function (event) {

    event.preventDefault();

    // Prevent navigation if pricing is not calculated
    if (!pricingDetails) {
        return;
    }

    try {
        continueBtn.classList.add("disabled");
        continueBtn.setAttribute("aria-disabled", "true");

        continueBtn.textContent = "Saving...";

        const response = await fetch(
            `/listings/${listingId}/book/pricing-details`,
            {
                method: "POST"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to save pricing details."
            );
        }

        // Navigate to Review page after successful saving
        window.location.href =
            `/listings/${listingId}/book/review`;

    } catch (error) {

        console.error("Booking error:", error);
    
        continueBtn.classList.remove("disabled");
        continueBtn.setAttribute("aria-disabled", "false");
    
        continueBtn.innerHTML =
        'Review Booking <i class="fa-solid fa-arrow-right"></i>';
    }
});

// Restore Review Booking button when returning to Pricing Details
window.addEventListener("pageshow", function () {

    continueBtn.classList.remove("disabled");
    continueBtn.setAttribute("aria-disabled", "false");

    continueBtn.innerHTML =
        'Review Booking <i class="fa-solid fa-arrow-right"></i>';
});