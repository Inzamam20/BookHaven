/* eslint-disable func-names */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */

document.addEventListener('DOMContentLoaded', () => {
    const volumeRadios = document.querySelectorAll('.volume-radio');

    volumeRadios.forEach((radio) => {
        radio.addEventListener('change', function () {
            // Find the closest .card-body element
            const cardBody = this.closest('.card-body');

            // Find the price element within the .card-body
            const priceNumber = cardBody.querySelector('.card-price .priceNumber');

            // Get the data-price attribute from the radio button
            const selectedPrice = this.getAttribute('data-price') || 0;

            // Update the displayed price
            priceNumber.innerText = selectedPrice;
        });

        // Trigger the 'change' event for the initially checked radio button
        if (radio.checked) {
            radio.dispatchEvent(new Event('change'));
        }
    });
});
