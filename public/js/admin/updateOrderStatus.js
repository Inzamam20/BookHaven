/* eslint-disable prettier/prettier */
/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-alert */
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to each dropdown item
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    dropdownItems.forEach((item) => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const newStatus = this.getAttribute('data-status');

            // Find the parent dropdown for this item
            const dropdown = this.closest('.dropdown');

            // Find the dropdown button in the same row
            const dropdownButton = dropdown.querySelector('.dropdown-toggle');

            const orderId = dropdownButton.getAttribute('data-order-id');

            console.log('Order ID:', orderId);
            console.log('New Status:', newStatus);

            const data = { newStatus };
            const confirmation = confirm(`Are you sure you want to change the status to ${newStatus}?`);

            if (confirmation) {
                // Send AJAX request to update order status using jQuery
                $.ajax({
                    type: 'POST',
                    url: `/admin/api/orders/updateOrderStatus/${orderId}`,
                    data,
                    success(serverData) {
                        // Handle the response as needed
                        console.log(serverData);
                        location.reload(); // Reload the page after successful update
                    },
                    error(error) {
                        console.error('Error:', error);
                    },
                });
            }
        });
    });
});
