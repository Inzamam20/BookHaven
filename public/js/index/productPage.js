/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable operator-linebreak */
/* eslint-disable no-undef */
// Get the elements
const radio3ml = document.getElementById('radio3ml');
const radio5ml = document.getElementById('radio5ml');
const displayedPrice = document.getElementById('displayedPrice');

document.addEventListener('DOMContentLoaded', function () {
    // Get the current URL
    const currentUrl = window.location.href;
    // console.log(currentUrl);

    // Set the value of the hidden input field
    document.getElementById('origin').value = currentUrl;
});

// Function to update the displayed price based on the selected radio button
function updatePrice() {
    // Get the selected value
    const selectedVolume = document.querySelector('input[name="volume"]:checked').value;

    // Update the displayed price based on the selected volume
    displayedPrice.textContent =
        selectedVolume === '3' ? window.productPrices.priceOf3ml : window.productPrices.priceOf5ml;
}

// Add an event listener to the radio buttons
radio3ml.addEventListener('change', updatePrice);
radio5ml.addEventListener('change', updatePrice);

// Initialize with the price of 3ml when the page loads
updatePrice();

const quantityInput = document.getElementById('quantityInput');

// Function to decrease the quantity
function decreaseQuantity() {
    const currentQuantity = parseInt(quantityInput.value, 10);
    const newQuantity = Math.max(currentQuantity - 1, 1); // Ensure the quantity is at least 1
    quantityInput.value = newQuantity;
    updatePrice();
}

// Function to increase the quantity
function increaseQuantity() {
    const currentQuantity = parseInt(quantityInput.value, 10);
    const newQuantity = currentQuantity + 1;
    quantityInput.value = newQuantity;
    updatePrice();
}

// Add event listeners to the buttons
document
    .querySelector('button[onclick="decreaseQuantity"]')
    .addEventListener('click', decreaseQuantity);
document
    .querySelector('button[onclick="increaseQuantity"]')
    .addEventListener('click', increaseQuantity);
