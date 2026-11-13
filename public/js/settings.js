document.addEventListener("DOMContentLoaded", () => {

    // Change Password elements
    const passwordVerificationStep = document.querySelector("#passwordVerificationStep");
    const verifyPasswordForm = document.querySelector("#verifyPasswordForm");
    const currentPassword = document.querySelector("#currentPassword");
    const passwordVerificationMessage = document.querySelector("#passwordVerificationMessage");

    const passwordChangeStep = document.querySelector("#passwordChangeStep");
    const changePasswordForm = document.querySelector("#changePasswordForm");
    const newPassword = document.querySelector("#newPassword");
    const confirmNewPassword = document.querySelector("#confirmNewPassword");
    const changePasswordMessage = document.querySelector("#changePasswordMessage");
    const cancelPasswordChangeForm = document.querySelector("#cancelPasswordChangeForm");

    // Delete Account elements
    const deleteVerificationStep = document.querySelector("#deleteVerificationStep");
    const verifyDeletePasswordForm = document.querySelector("#verifyDeletePasswordForm");
    const deleteCurrentPassword = document.querySelector("#deleteCurrentPassword");
    const deleteVerificationMessage = document.querySelector("#deleteVerificationMessage");

    const deleteConfirmationStep = document.querySelector("#deleteConfirmationStep");
    const deleteAccountForm = document.querySelector("#deleteAccountForm");
    const deleteAccountMessage = document.querySelector("#deleteAccountMessage");
    const cancelDeleteAccountForm = document.querySelector("#cancelDeleteAccountForm");


    // Show an inline message
    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = `settings-status-message ${type}`;
        element.hidden = false;
    }


    // Validate that both new passwords match
    function validatePasswordMatch() {
        confirmNewPassword.setCustomValidity(
            confirmNewPassword.value &&
                newPassword.value !== confirmNewPassword.value
                ? "Passwords do not match."
                : ""
        );
    }

    newPassword.addEventListener("input", validatePasswordMatch);
    confirmNewPassword.addEventListener("input", validatePasswordMatch);


    // STEP 1: Verify current password before changing it
    verifyPasswordForm.addEventListener("submit", (event) => {
        // Check Bootstrap form validation
        if (!verifyPasswordForm.checkValidity()) {
            event.preventDefault();
            verifyPasswordForm.classList.add("was-validated");
            currentPassword.focus();
        }

        // If valid, allow the form to submit to the backend
    });

    // STEP 2: Validate and submit the new password
    // Submit the new password to the backend
    changePasswordForm.addEventListener("submit", (event) => {

        // Check form validation
        if (!changePasswordForm.checkValidity()) {
            event.preventDefault();

            changePasswordForm.classList.add("was-validated");
            return;
        }

        // Allow the form to submit to the backend
    });


    // STEP 1: Verify current password before deleting the account
    // Submit account deletion password verification to the backend
    verifyDeletePasswordForm.addEventListener("submit", (event) => {

        // Check form validation
        if (!verifyDeletePasswordForm.checkValidity()) {
            event.preventDefault();
            verifyDeletePasswordForm.classList.add("was-validated");
        }

        // Otherwise, allow the form to submit to the backend
    });


    // STEP 2: Final account deletion
    // Submit account deletion request to the backend
    deleteAccountForm.addEventListener("submit", (event) => {

        // Check form validation
        if (!deleteAccountForm.checkValidity()) {
            event.preventDefault();
            deleteAccountForm.classList.add("was-validated");
        }

        // Otherwise, allow the form to submit to the backend
    });

    // Show and hide password fields
    document.querySelectorAll(".settings-password-toggle").forEach((button) => {

        button.addEventListener("click", () => {
            const targetId = button.dataset.target;
            const passwordInput = document.getElementById(targetId);
            const icon = button.querySelector("i");

            // Toggle password visibility
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.classList.replace("fa-eye", "fa-eye-slash");
                button.setAttribute("aria-label", "Hide password");
            } else {
                passwordInput.type = "password";
                icon.classList.replace("fa-eye-slash", "fa-eye");
                button.setAttribute("aria-label", "Show password");
            }
        });

    });

    // Preserve scroll position when verifying the delete account password
    verifyDeletePasswordForm.addEventListener("submit", () => {

        if (verifyDeletePasswordForm.checkValidity()) {
            sessionStorage.setItem("settingsScrollPosition", window.scrollY);
        }
    });

    // Restore scroll position after the page reloads
    window.addEventListener("pageshow", () => {

        const savedPosition = sessionStorage.getItem("settingsScrollPosition");

        if (savedPosition !== null) {
            sessionStorage.removeItem("settingsScrollPosition");

            window.requestAnimationFrame(() => {
                window.scrollTo(0, Number(savedPosition));
            });
        }
    });

});