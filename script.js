// API URL to fetch cryptocurrency data
const apiURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

// Get elements from the DOM
const cryptoList = document.getElementById('crypto-list');
const comparisonContainer = document.getElementById('comparison-container');

// Initialize selected cryptocurrencies
let selectedCryptos = JSON.parse(localStorage.getItem('selectedCryptos')) || [];

// Fetch cryptocurrency data from the API
function fetchCryptos() {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            renderCryptoList(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Render the list of cryptocurrencies
function renderCryptoList(data) {
    cryptoList.innerHTML = '';  // Clear previous list
    data.forEach(crypto => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${crypto.name} (${crypto.symbol.toUpperCase()})</span>
            <span>$${crypto.current_price}</span>
        `;
        // Add click event to select currency
        listItem.addEventListener('click', () => selectCurrency(crypto));
        cryptoList.appendChild(listItem);
    });
}

// Select a cryptocurrency for comparison
function selectCurrency(crypto) {
    if (selectedCryptos.length < 5 && !selectedCryptos.some(item => item.id === crypto.id)) {
        selectedCryptos.push(crypto);
        localStorage.setItem('selectedCryptos', JSON.stringify(selectedCryptos));
        renderComparison();
    } else {
        alert('You can only select up to 5 cryptocurrencies.');
    }
}

// Render the comparison section
function renderComparison() {
    comparisonContainer.innerHTML = '';  // Clear previous comparison list

    if (selectedCryptos.length === 0) {
        comparisonContainer.innerHTML = '<p>No cryptocurrencies selected. Please click on a cryptocurrency to add it to the comparison.</p>';
    } else {
        selectedCryptos.forEach(crypto => {
            const comparisonItem = document.createElement('div');
            comparisonItem.classList.add('comparison-item');
            comparisonItem.innerHTML = `
                <h4>${crypto.name} (${crypto.symbol.toUpperCase()})</h4>
                <p>Price: $${crypto.current_price}</p>
                <p>24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
                <button onclick="removeCrypto('${crypto.id}')">Remove</button>
            `;
            comparisonContainer.appendChild(comparisonItem);
        });
    }
}

// Remove a cryptocurrency from the comparison list
function removeCrypto(cryptoId) {
    selectedCryptos = selectedCryptos.filter(crypto => crypto.id !== cryptoId);
    localStorage.setItem('selectedCryptos', JSON.stringify(selectedCryptos));
    renderComparison();
}

// Initial fetch and render
fetchCryptos();
renderComparison();
