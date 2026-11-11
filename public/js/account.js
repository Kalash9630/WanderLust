document.addEventListener("DOMContentLoaded", () => {
    const dobElement = document.querySelector("#profile-dob");
    const ageElement = document.querySelector("#profile-age");

    if (!dobElement || !ageElement) return;

    const dobValue = dobElement.dataset.dob;

    if (!dobValue) {
        ageElement.textContent = "Not provided";
        return;
    }

    const birthDate = new Date(`${dobValue}T00:00:00`);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if the birthday hasn't occurred this year
    const hasBirthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
        age--;
    }

    ageElement.textContent = `${age} Years`;
});

document.addEventListener("DOMContentLoaded", () => {
    const dobElement = document.querySelector("#profile-dob");
    const ageElement = document.querySelector("#profile-age");
    const dobInput = document.querySelector("#profileDobInput");

    const profileSection = document.querySelector(".profile-details-section");
    const profileForm = document.querySelector("#profileForm");
    const editProfileBtn = document.querySelector("#editProfileBtn");
    const cancelProfileBtn = document.querySelector("#cancelProfileBtn");

    // Calculate age using the date of birth
    function calculateAge(dob) {
        if (!dob) return "Not provided";

        const birthDate = new Date(`${dob}T00:00:00`);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        const hasBirthdayPassed =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
                today.getDate() >= birthDate.getDate());

        if (!hasBirthdayPassed) age--;

        return `${age} Years`;
    }

    // Display the current age
    if (dobElement && ageElement) {
        ageElement.textContent = calculateAge(dobElement.dataset.dob);
    }

    // Update age when the date of birth changes
    if (dobInput) {
        dobInput.addEventListener("change", () => {
            ageElement.textContent = calculateAge(dobInput.value);
        });
    }

    // Switch to edit mode
    editProfileBtn.addEventListener("click", () => {
        profileSection.classList.add("edit-mode");

        profileForm.querySelectorAll(".profile-edit-input").forEach(input => {
            input.disabled = false;
        });

        editProfileBtn.innerHTML = `
            <i class="fa-regular fa-floppy-disk"></i>
            Save Changes
        `;
    });

    // Cancel editing and restore original values
    cancelProfileBtn.addEventListener("click", () => {
        profileForm.reset();

        profileForm.querySelectorAll(".profile-edit-input").forEach(input => {
            input.disabled = true;
        });

        profileSection.classList.remove("edit-mode");

        editProfileBtn.innerHTML = `
            <i class="fa-regular fa-pen-to-square"></i>
            Edit Profile
        `;

        ageElement.textContent = calculateAge(dobElement.dataset.dob);
    });

    // Prevent form submission until backend saving is implemented
    profileForm.addEventListener("submit", event => {
        event.preventDefault();
    });
});