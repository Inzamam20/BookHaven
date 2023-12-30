/* eslint-disable no-restricted-globals */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
function decreaseQuantity(index) {
    const quantityInput = document.getElementById(`quantity${index}`);
    let newQuantity = parseInt(quantityInput.value, 10);
    if (newQuantity > 1) {
        newQuantity--;
        quantityInput.value = newQuantity;
        // You may want to update the unit total and total here
    }
}

function updateTotal(cartItems) {
    let totalAmount = 0;

    for (let i = 0; i < cartItems.length; i++) {
        totalAmount += cartItems[i].price * cartItems[i].quantity;
    }

    document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);
}

function increaseQuantity(index) {
    const quantityInput = document.getElementById(`quantity${index}`);
    let newQuantity = parseInt(quantityInput.value, 10);
    newQuantity++;
    console.log(newQuantity);
    quantityInput.value = newQuantity;
    // You may want to update the unit total and total here
}

function removeCart(email, perfumeID, volume, index, cartItems, quantity) {
    // console.log(email);
    // console.log(perfumeID);
    // console.log(volume);

    $.ajax({
        type: 'DELETE',
        url: `/cart/remove/${perfumeID}`,
        data: {
            email,
            volume,
            quantity,
        },
        success(response) {
            if (response.success) {
                const object = JSON.parse(cartItems);
                // Handle success
                console.log('Product Removed from Cart successfully!');

                console.log(response);

                // Reload the page
                location.reload();

                // Dynamically Find and remove the table row based on perfumeID and volume
                // const tableRow = document.getElementById(`tableRow${index}`);

                // // Check if the row exists
                // if (tableRow) {
                //     // Example: Remove the row
                //     tableRow.remove();

                //     object.splice(index, 1);
                //     updateTotal(object);
                // } else {
                //     console.log('Row not found');
                // }
            } else {
                // Handle failure
                console.log(response.message);
            }
        },
        error(xhr) {
            if (xhr.status === 500) {
                console.log(xhr.responseText);
            }
        },
    });
}
