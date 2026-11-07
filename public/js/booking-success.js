// =========================================
// BOOKING SUCCESS PAGE
// =========================================

// Clear saved availability dates
sessionStorage.removeItem("availableDates");

// Get countdown element
const redirectCountdown = document.getElementById("redirectCountdown");

// Set initial countdown
let remainingSeconds = 60;

// Update countdown every second
const countdownInterval = setInterval(() => {

    remainingSeconds--;

    // Update countdown display
    if (redirectCountdown) {
        redirectCountdown.textContent = remainingSeconds;
    }

    // Redirect when countdown finishes
    if (remainingSeconds <= 0) {
        clearInterval(countdownInterval);
        window.location.href = "/listings";
    }

}, 1000);