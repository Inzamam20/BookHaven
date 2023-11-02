/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
// Example starter JavaScript for disabling form submissions if there are invalid fields

(() => {
    const forms = document.querySelectorAll('.needs-validation');

    const isValidPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%*&?])[A-Za-z\d!@#$%*&?]{8,}$/;
        return regex.test(password);
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const isValidPhoneNumber = (phoneNo) => {
        // Regular expression to match a valid Bangladeshi phone number format
        const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

        return regex.test(phoneNo);
    };

    Array.from(forms).forEach((form) => {
        const emailField = form.querySelector('#email');
        const passwordField = form.querySelector('#password');
        const confirmPasswordField = form.querySelector('#confirmPassword');
        const passwordFeedback = form.querySelector('#passwordFeedback');
        const confirmPasswordFeedback = form.querySelector('#confirmPasswordFeedback');
        const emailFeedback = form.querySelector('#emailFeedback');

        const phoneInput = form.querySelector('#phoneNo');
        const phoneNumberFeedback = form.querySelector('#phoneNoFeedback');

        emailField.addEventListener('input', () => {
            if (!isValidEmail(emailField.value)) {
                emailFeedback.textContent = 'Invalid email address!';
            } else {
                emailFeedback.textContent = '';
            }
        });

        passwordField.addEventListener('input', () => {
            if (!isValidPassword(passwordField.value)) {
                passwordFeedback.textContent = 'Password should be 8 characters or more with uppercase, lowercase, number, and special character.';
            } else {
                passwordFeedback.textContent = ''; // Clear the feedback if the password is valid
            }
        });

        confirmPasswordField.addEventListener('input', () => {
            if (passwordField.value !== confirmPasswordField.value) {
                confirmPasswordFeedback.textContent = 'Passwords do not match.';
            } else {
                confirmPasswordFeedback.textContent = '';
            }
        });

        phoneInput.addEventListener('input', () => {
            if (isValidPhoneNumber(phoneInput.value)) {
                phoneNumberFeedback.textContent = ''; // Clear the feedback if the phone number is valid
            } else {
                phoneNumberFeedback.textContent = 'Invalid phone number!'; // Provide feedback for invalid phone number format
            }
        });

        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
})();
