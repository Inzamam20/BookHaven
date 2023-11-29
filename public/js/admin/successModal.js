/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable prefer-promise-reject-errors */

// function showModal() {
//     $.ajax({
//         url: '/admin/anikatesting',
//         method: 'GET',
//         data: {
//             year: 23,
//             month: 2,
//             date: 2,
//         },
//     }).done((response) => {
//         alert(response.msg);
//         console.log('OKAY');
//     });
// }

// Get the Modal
const successModal = new bootstrap.Modal(document.getElementById('success'));
successModal.show();

// Get the close button
const closeButton = document.getElementsByClassName('close')[0];

document.addEventListener('DOMContentLoaded', () => {
    showModal();
});
// When the user clicks the close button, hide the modal
closeButton.onclick = () => {
    successModal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target === successModal) {
        successModal.style.display = 'none';
    }
};
