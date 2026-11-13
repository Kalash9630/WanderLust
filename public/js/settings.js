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
    verifyDeletePasswordForm.addEventListener("submit", (event) => {

        if (!verifyDeletePasswordForm.checkValidity()) {
            event.preventDefault();
            verifyDeletePasswordForm.classList.add("was-validated");
            deleteCurrentPassword.focus();
            return;
        }

        // TEMPORARY: Simulate successful verification for frontend testing.
        // Remove this preventDefault and stage-switching logic after backend integration.
        event.preventDefault();

        deleteVerificationStep.hidden = true;
        deleteConfirmationStep.hidden = false;

        showMessage(
            deleteAccountMessage,
            "Frontend demonstration only. Your password has not been verified by the server.",
            "info"
        );
    });


    // STEP 2: Final account deletion
    deleteAccountForm.addEventListener("submit", (event) => {

        // TEMPORARY: Prevent actual account deletion until backend integration.
        event.preventDefault();

        showMessage(
            deleteAccountMessage,
            "Backend integration is pending. Your account has not been deleted.",
            "info"
        );
    });


    // Cancel account deletion
    cancelDeleteAccountForm.addEventListener("submit", (event) => {

        // TEMPORARY: Simulate cancellation on the frontend.
        // Remove this preventDefault after connecting the backend cancellation route.
        event.preventDefault();

        verifyDeletePasswordForm.reset();
        verifyDeletePasswordForm.classList.remove("was-validated");

        deleteConfirmationStep.hidden = true;
        deleteVerificationStep.hidden = false;

        deleteAccountMessage.hidden = true;
        deleteVerificationMessage.hidden = true;
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

});