/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable prefer-arrow-callback */

// Function to update the cart count
const updateCartCount = async () => {
    try {
        const response = await fetch('/api/cart/count'); // Replace with your actual API endpoint
        const data = await response.json();
        const cartItemCount = data.count; // Assuming the response has a property 'count'
        document.getElementById('cartItemCount').textContent = cartItemCount;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
};

function addToCart(productId) {
    const quantityInput = document.getElementById('quantityInput');
    let currentQuantity = 1;
    if (quantityInput !== null) {
        currentQuantity = parseInt(quantityInput.value, 10);
    } else {
        currentQuantity = 1;
    }

    // Assuming Radio buttons with IDs 'radio3ml' and 'radio5ml'
    const radio3ml = document.getElementById('radio3ml');
    const radio5ml = document.getElementById('radio5ml');

    // Get the selected value
    let selectedVolume = 3;
    if (radio3ml && radio5ml) {
        if (radio3ml.checked) {
            selectedVolume = radio3ml.value;
        } else if (radio5ml.checked) {
            selectedVolume = radio5ml.value;
        }
    }

    // console.log(productId);
    // console.log(currentQuantity);
    // AJAX request
    $.ajax({
        type: 'POST',
        url: `/cart/add/${productId}`,
        data: {
            quantity: currentQuantity,
            volume: selectedVolume,
        }, // Include the quantity in the request data
        success(response) {
            // After adding a product to the cart successfully
            updateCartCount();

            // After adding product to cart successfully
            $('#successCart').modal('show');

            console.log('Product added to cart successfully');
        },
        error(xhr) {
            // Handle error response
            if (xhr.status === 404) {
                // Product is out of stock, show a modal or handle the message
                console.log('Product is out of stock');
                // Show the out of stock modal
                $('#outOfStockModal').modal('show');
            } else {
                // console.error('Error adding product to cart:', xhr.responseText);
                console.error('Error adding product to cart:');
            }
        },
    });
}

$(document).ready(function () {
    updateCartCount();
});
