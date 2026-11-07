// =========================================
// GET HTML ELEMENTS
// =========================================

const reviewLayout = document.getElementById("reviewLayout");

const reviewCheckIn = document.getElementById("reviewCheckIn");
const reviewCheckOut = document.getElementById("reviewCheckOut");

const confirmBookingBtn = document.getElementById("confirmBookingBtn");
const cancelBookingForm = document.getElementById("cancelBookingForm");

// =========================================
// CHECK IF REVIEW PAGE EXISTS
// =========================================

if (reviewLayout) {

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
    // DISPLAY FORMATTED STAY DATES
    // =========================================

    function displayStayDates() {

        const checkIn = reviewCheckIn.textContent.trim();
        const checkOut = reviewCheckOut.textContent.trim();

        if (checkIn && checkIn !== "--") {
            reviewCheckIn.textContent = formatDate(checkIn);
        }

        if (checkOut && checkOut !== "--") {
            reviewCheckOut.textContent = formatDate(checkOut);
        }

    }


    // =========================================
    // INITIALIZE REVIEW PAGE
    // =========================================

    displayStayDates();

}

// =========================================
// CANCEL BOOKING
// =========================================

if (cancelBookingForm) {

    cancelBookingForm.addEventListener("submit", function () {

        // Clear saved availability dates from browser session storage
        sessionStorage.removeItem("availableDates");

    });

}
