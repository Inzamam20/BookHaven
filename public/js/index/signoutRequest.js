/* eslint-disable func-names */
/* eslint-disable no-undef */

document.addEventListener('DOMContentLoaded', () => {
    const signOutButton = document.getElementById('signOutButton');

    if (signOutButton) {
        signOutButton.addEventListener('click', () => {
            // Perform an AJAX request to the server to handle sign-out
            fetch('/users/signout', {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        // Clear the local session and redirect to the home page
                        window.location.href = '/';
                    } else {
                        // Handle errors if needed
                        console.error('Sign-out failed');
                    }
                })
                .catch((error) => {
                    console.error('Error during sign-out:', error);
                });
        });
    }
});
