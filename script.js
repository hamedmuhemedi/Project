// Free API Key (1500 requests/month free)
const API_KEY = 'YOUR_API_KEY_HERE'; // I DON'T HAVE ONE!!!
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

// Popular currencies
const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'IRR', name: 'Iranian Rial', flag: '🇮🇷' }, 
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' } 
];

// Global variables
let exchangeRates = {};
let lastUpdate = new Date();

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const rateInput = document.getElementById('rate');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const refreshBtn = document.getElementById('refreshBtn');
const resultText = document.getElementById('resultText');
const conversionText = document.getElementById('conversionText');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const lastUpdateText = document.getElementById('lastUpdateText');
const darkModeToggle = document.getElementById('darkModeToggle');

// History from localStorage
let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

// Initialize
async function init() {
    // Populate currency dropdowns
    populateCurrencyDropdowns();
    
    // Fetch exchange rates
    await fetchExchangeRates();
    
    // Set default currencies
    setDefaultCurrencies();
    
    // Load history
    loadHistory();
    
    // Update last update time
    updateLastUpdateTime();
    
    // Set up dark mode
    setupDarkMode();
    
    // Convert on page load
    convertCurrency();
}

// Populate currency dropdowns
function populateCurrencyDropdowns() {
    // Clear existing options
    fromCurrencySelect.innerHTML = '';
    toCurrencySelect.innerHTML = '';
    
    popularCurrencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency.code;
        option1.textContent = `${currency.flag} ${currency.name} (${currency.code})`;
        
        const option2 = option1.cloneNode(true);
        
        fromCurrencySelect.appendChild(option1);
        toCurrencySelect.appendChild(option2);
    });
}

// Set default currencies 
function setDefaultCurrencies() {
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'IRR';
    updateRateDisplay();
}

// Fetch exchange rates from API
async function fetchExchangeRates() {
    try {
        // If no API key, use sample data
        if (API_KEY === 'YOUR_API_KEY_HERE') {
            console.warn('Get a free API key from: https://www.exchangerate-api.com/');
            console.warn('Note: Free API does not include IRR. Using sample data.');
            
            // Sample data for testing
            exchangeRates = {
                USD: 1,
                EUR: 0.92,
                GBP: 0.79,
                JPY: 150.5,
                CAD: 1.36,
                AUD: 1.56,
                CHF: 0.88,
                CNY: 7.28,
                IRR: 1395000,
                INR: 83.2,
                SGD: 1.36,
                NZD: 1.68,
                KRW: 1330,
                BRL: 4.92,
                MXN: 17.28,
                RUB: 92.5,
                AED: 3.67,
                SAR: 3.75
            };
            
            lastUpdate = new Date();
            return;
        }
        
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.result === 'success') {
            exchangeRates = data.conversion_rates;
            lastUpdate = new Date(data.time_last_update_utc);
            console.log('Exchange rates fetched successfully');
            
            // Note: Free API doesn't include IRR, so we'll add it manually
            if (!exchangeRates.IRR) {
                exchangeRates.IRR = 42000; // Add approximate IRR rate
                console.log('Added approximate IRR rate (free API does not include IRR)');
            }
        } else {
            throw new Error('Failed to fetch exchange rates');
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        
        // Fallback to sample data on error 
        exchangeRates = {
            USD: 1,
            EUR: 0.92,
            GBP: 0.79,
            JPY: 150.5,
            CAD: 1.36,
            AUD: 1.56,
            CHF: 0.88,
            CNY: 7.28,
            IRR: 1395000,
            INR: 83.2,
            SGD: 1.36,
            NZD: 1.68,
            KRW: 1330,
            BRL: 4.92,
            MXN: 17.28,
            RUB: 92.5,
            AED: 3.67,
            SAR: 3.75
        };
        
        lastUpdate = new Date();
        
        alert('Connection error. Using sample data including Iranian Rial.');
    }
    
    updateRateDisplay();
}

// Update rate display
function updateRateDisplay() {
    const from = fromCurrencySelect.value;
    const to = toCurrencySelect.value;
    
    if (exchangeRates[from] && exchangeRates[to]) {
        const rate = exchangeRates[to] / exchangeRates[from];
        
        // Format rate differently for IRR (remove decimals)
        if (to === 'IRR' || from === 'IRR') {
            rateInput.value = rate.toFixed(0);
        } else {
            rateInput.value = rate.toFixed(6);
        }
    }
}

// Convert currency
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrencySelect.value;
    const to = toCurrencySelect.value;
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (!exchangeRates[from] || !exchangeRates[to]) {
        alert('Selected currency is not available');
        return;
    }
    
    // Calculate rate
    const rate = exchangeRates[to] / exchangeRates[from];
    const result = amount * rate;
    
    // Display result
    const fromCurrency = popularCurrencies.find(c => c.code === from);
    const toCurrency = popularCurrencies.find(c => c.code === to);
    
    // Special formatting for IRR
    if (to === 'IRR' || from === 'IRR') {
        resultText.textContent = `${amount.toLocaleString()} ${from} = ${result.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${to}`;
        conversionText.textContent = `${amount} ${fromCurrency?.name || from} = ${result.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${toCurrency?.name || to}`;
    } else {
        resultText.textContent = `${amount.toLocaleString()} ${from} = ${result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to}`;
        conversionText.textContent = `${amount} ${fromCurrency?.name || from} = ${result.toFixed(2)} ${toCurrency?.name || to}`;
    }
    
    // Save to history
    addToHistory(amount, from, to, result, rate);
    
    // Update rate display
    updateRateDisplay();
}

// Add to history
function addToHistory(amount, from, to, result, rate) {
    const historyItem = {
        id: Date.now(),
        amount,
        from,
        to,
        result,
        rate,
        date: new Date().toLocaleString('en-US')
    };
    
    history.unshift(historyItem);
    
    // Keep only last 10 items
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    // Save to localStorage
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    
    // Reload history
    loadHistory();
}

// Load history
function loadHistory() {
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="text-center text-muted py-3">
                <i class="fas fa-history fa-2x mb-2"></i>
                <p>No conversions yet</p>
            </div>
        `;
        return;
    }
    
    history.forEach(item => {
        const fromCurrency = popularCurrencies.find(c => c.code === item.from);
        const toCurrency = popularCurrencies.find(c => c.code === item.to);
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        // Format result based on currency
        const formattedResult = (item.to === 'IRR' || item.from === 'IRR') 
            ? item.result.toLocaleString('en-US', { maximumFractionDigits: 0 })
            : item.result.toFixed(2);
        
        historyItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <div>
                    <strong>${item.amount} ${item.from}</strong>
                    <i class="fas fa-arrow-right mx-2"></i>
                    <strong>${formattedResult} ${item.to}</strong>
                </div>
                <small class="text-muted">${item.date}</small>
            </div>
            <small class="text-muted">Rate: 1 ${item.from} = ${item.rate.toFixed(4)} ${item.to}</small>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Update last update time
function updateLastUpdateTime() {
    const timeString = lastUpdate.toLocaleTimeString('en-US');
    const dateString = lastUpdate.toLocaleDateString('en-US');
    lastUpdateText.textContent = `Last updated: ${dateString} at ${timeString}`;
}

// Swap currencies
function swapCurrencies() {
    const fromValue = fromCurrencySelect.value;
    const toValue = toCurrencySelect.value;
    
    fromCurrencySelect.value = toValue;
    toCurrencySelect.value = fromValue;
    
    updateRateDisplay();
    
    // Convert again if amount is entered
    if (amountInput.value && amountInput.value > 0) {
        convertCurrency();
    }
}

// Setup dark mode
function setupDarkMode() {
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('darkMode', 'true');
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkMode', 'false');
        }
    });
}

// Event Listeners
convertBtn.addEventListener('click', convertCurrency);

swapBtn.addEventListener('click', swapCurrencies);

refreshBtn.addEventListener('click', async () => {
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    await fetchExchangeRates();
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    updateLastUpdateTime();
    
    // Convert again if amount is entered
    if (amountInput.value && amountInput.value > 0) {
        convertCurrency();
    }
});

amountInput.addEventListener('input', () => {
    // Auto-convert when amount changes
    if (amountInput.value && amountInput.value > 0) {
        convertCurrency();
    }
});

fromCurrencySelect.addEventListener('change', () => {
    updateRateDisplay();
    if (amountInput.value && amountInput.value > 0) {
        convertCurrency();
    }
});

toCurrencySelect.addEventListener('change', () => {
    updateRateDisplay();
    if (amountInput.value && amountInput.value > 0) {
        convertCurrency();
    }
});

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all history?')) {
        history = [];
        localStorage.removeItem('conversionHistory');
        loadHistory();
    }
});

// Convert on Enter key
amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        convertCurrency();
    }
});

// Initialize
init();