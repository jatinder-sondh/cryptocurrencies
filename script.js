// API URL to fetch cryptocurrency data
// const apiURL = 'cryptos.json'; // You can replace with real API if necessary
const apiURL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false';


// Get elements from the DOM
const cryptoList = document.getElementById('crypto-list');
const comparisonContainer = document.getElementById('comparison-container');
const sortBySelect = document.getElementById('sort-by');
const viewAsSelect = document.getElementById('view-as');

// Initialize selected cryptocurrencies
let selectedCryptos = JSON.parse(localStorage.getItem('selectedCryptos')) || [];
let userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {
    sortBy: 'price',
    viewAs: 'grid'
};

// Apply user preferences
applyUserPreferences();

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
    const sortedData = sortCryptos(data);
    sortedData.forEach(crypto => {
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
                <button onclick="removeFromComparison('${crypto.id}')">Remove</button>
            `;
            comparisonContainer.appendChild(comparisonItem);
        });
    }
}

// Remove a cryptocurrency from the comparison
function removeFromComparison(id) {
    selectedCryptos = selectedCryptos.filter(crypto => crypto.id !== id);
    localStorage.setItem('selectedCryptos', JSON.stringify(selectedCryptos));
    renderComparison();
}

// Apply user preferences for sorting and view
function applyUserPreferences() {
    sortBySelect.value = userPreferences.sortBy;
    viewAsSelect.value = userPreferences.viewAs;

    viewAsSelect.addEventListener('change', (e) => {
        userPreferences.viewAs = e.target.value;
        localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
        applyUserPreferences();
    });

    // Apply grid or list view class
    document.body.classList.toggle('grid-view', userPreferences.viewAs === 'grid');
    document.body.classList.toggle('list-view', userPreferences.viewAs === 'list');

    sortBySelect.addEventListener('change', (e) => {
        userPreferences.sortBy = e.target.value;
        localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
        fetchCryptos(); // Re-fetch to apply new sorting
    });
}

// Sort cryptocurrencies based on user selection
function sortCryptos(data) {
    return data.sort((a, b) => {
        if (userPreferences.sortBy === 'price') {
            return b.current_price - a.current_price;
        } else if (userPreferences.sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (userPreferences.sortBy === 'change') {
            return b.price_change_percentage_24h - a.price_change_percentage_24h;
        }
        return 0;
    });
}

// Initialize the app
fetchCryptos();
