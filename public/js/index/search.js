/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */

const searchElement = document.getElementById('autocomplete_search');
const searchResultsElement = document.getElementById('search_result');

function loadData(query) {
    fetch(`/get_data?search_query=${query}`)
        .then((response) => response.json())
        .then((responseData) => {
            let html = '';

            if (responseData.length > 0) {
                for (let count = 0; count < responseData.length; count++) {
                    const regularExpression = new RegExp(`(${query})`, 'gi');

                    html += `<a href="#" class="list-group-item list-group-item-action d-block">${`${responseData[
                        count
                    ].name.replace(
                        regularExpression,
                        '<span class="text-primary fw-bold">$1</span>',
                    )}</a>`}`;
                }
            } else {
                html = '<a href="#" class="list-group-item list-group-item-action disabled">No results found</a>';
            }

            document.getElementById('search_result').innerHTML = html;
        });
}

searchElement.oninput = () => {
    const query = searchElement.value;

    loadData(query);

    // Show/hide the search results dropdown based on the input
    if (query) {
        searchResultsElement.style.display = 'block';
    } else {
        searchResultsElement.style.display = 'none';
    }
};
