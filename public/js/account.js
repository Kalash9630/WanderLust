document.addEventListener("DOMContentLoaded", () => {
  // Select profile elements
  const profileSection = document.querySelector("#profileDetailsSection");
  if (profileSection) {

    const profileForm = document.querySelector("#profileForm");
    const editProfileBtn = document.querySelector("#editProfileBtn");
    const cancelProfileBtn = document.querySelector("#cancelProfileBtn");

    // const usernameInput = profileForm.querySelector('[name="username"]');
    const mobileInput = document.querySelector("#profileMobile");
    // const sexInput = profileForm.querySelector('[name="sex"]');

    const dobElement = document.querySelector("#profile-dob");
    const ageElement = document.querySelector("#profile-age");

    // const viewValues = profileSection.querySelectorAll(".profile-view-value");
    // const overviewUsername = document.querySelector(".profile-overview-info h4");

    const dobInput = document.querySelector("#profileDobInput");

    // Calculate age from date of birth
    function calculateAge(dob) {
      if (!dob) return "Not provided";

      const [year, month, day] = dob.split("-").map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();

      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return `${age} Years`;
    }

    // Initialize DOB calendar using flatpickr
    const dobCalendar = flatpickr(dobInput, {
      dateFormat: "Y-m-d",
      maxDate: "today",
      allowInput: false,
      disableMobile: true,
      defaultDate: dobInput.value || null,

      // Month and year navigation
      monthSelectorType: "dropdown",
      yearRange: [1900, new Date().getFullYear()],

      onChange: function (selectedDates, dateStr) {
        ageElement.textContent = calculateAge(dateStr);
      }
    });

    // Format date for display
    function formatDate(dob) {
      if (!dob) return "Not provided";

      const [year, month, day] = dob.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }

    // Format gender for display
    function formatGender(gender) {
      if (!gender) return "Not provided";

      if (gender === "prefer_not_to_say") {
        return "Prefer not to say";
      }

      return gender.charAt(0).toUpperCase() + gender.slice(1);
    }

    // Display initial age
    ageElement.textContent = calculateAge(dobElement.dataset.dob);

    // Enable edit mode
    editProfileBtn.addEventListener("click", () => {
      profileSection.classList.add("edit-mode");

      profileForm.querySelectorAll(".profile-edit-input").forEach((input) => {
        input.disabled = false;
      });
    });

    // Validate mobile number while typing
    function validateMobileNumber() {
      const mobile = mobileInput.value.trim();
      const feedback = mobileInput.nextElementSibling;

      // Mobile number is optional
      if (mobile === "") {
        mobileInput.classList.remove("is-invalid", "is-valid");
        feedback.style.display = "none";
        return true;
      }

      // Check for exactly 10 digits
      const isValid = /^[0-9]{10}$/.test(mobile);

      mobileInput.classList.toggle("is-valid", isValid);
      mobileInput.classList.toggle("is-invalid", !isValid);

      feedback.style.display = isValid ? "none" : "block";

      return isValid;
    }

    mobileInput.addEventListener("input", validateMobileNumber);

    // Save profile changes to the backend
    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const inputs = profileForm.querySelectorAll(".profile-edit-input");
      let isFormValid = true;

      // Validate all editable fields
      inputs.forEach((input) => {
        const isValid = input.checkValidity();

        input.classList.toggle("is-invalid", !isValid);

        if (!isValid) {
          isFormValid = false;
        }
      });

      // Stop if validation fails
      if (!isFormValid) return;

      try {

        const response = await fetch("/account", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
          },
          body: new URLSearchParams(new FormData(profileForm)),
        });

        if (response.ok) {
          // Reload to display the updated database information
          window.location.reload();
        } else {
          alert("Unable to update your profile. Please try again.");
        }

      } catch (error) {
        console.error("Profile update error:", error);
        alert("Something went wrong. Please try again.");
      }
    });


    // Return to view mode
    function exitEditMode() {
      profileForm.querySelectorAll(".profile-edit-input").forEach((input) => {
        input.disabled = true;
        input.classList.remove("is-invalid", "is-valid");
      });

      profileSection.classList.remove("edit-mode");
    }

    //   cancel button functionality
    cancelProfileBtn.addEventListener("click", () => {
      profileForm.reset();
      dobCalendar.setDate(dobElement.dataset.dob || null, false);
      ageElement.textContent = calculateAge(dobElement.dataset.dob);
      exitEditMode();
    });
  }

  // Booking tabs functionality 
  const bookingTabs = document.querySelectorAll(".booking-tab");
  const bookingContents = document.querySelectorAll(".booking-tab-content");

  bookingTabs.forEach(tab => {
    tab.addEventListener("click", () => {

      const target = tab.dataset.tab;

      // Remove active class from all tabs and contents
      bookingTabs.forEach(item => item.classList.remove("active"));
      bookingContents.forEach(content => content.classList.remove("active"));

      // Activate selected tab and content
      tab.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });
});

