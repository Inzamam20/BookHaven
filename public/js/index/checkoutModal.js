/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Function to open the checkout modal
function openCheckoutModal() {
    // Show the modal using Bootstrap's modal API
    $('#checkoutModal').modal('show');
}

// Function to close the checkout modal
function closeCheckoutModal() {
    // Hide the modal using Bootstrap's modal API
    $('#checkoutModal').modal('hide');
}

// Function to handle the form submission
function submitCheckoutForm() {
    // Get form data
    const formData = {
        phoneNo: document.getElementById('phoneNo').value,
        address: document.getElementById('address').value,
        deliveryType: document.getElementById('deliveryType').value,
        // Add more fields as needed
    };

    console.log(formData);

    // Perform an AJAX request to the server
    $.ajax({
        type: 'POST', // Use POST method for submitting form data
        url: '/cart/confirmorder', // Replace with your server endpoint
        data: formData,
        // eslint-disable-next-line no-unused-vars
        success(response) {
            if (response.success) {
                // Handle success response
                // console.log('asdasd');
                location.reload();
            }
        },
        error() {
            // Handle error response
            console.log('Error submitting the order');
            console.error('Error submitting order:');
        },
    });
}

// Attach event listeners to the modal and form
$(document).ready(() => {
    // Open the modal when the Checkout button is clicked
    document.getElementById('checkoutButton').addEventListener('click', openCheckoutModal);

    // Close the modal when the "Close" button is clicked
    document.getElementById('closeModalButton').addEventListener('click', closeCheckoutModal);

    // Submit the form when the "Confirm Order" button is clicked
    document.getElementById('confirmOrderButton').addEventListener('click', submitCheckoutForm);
});
