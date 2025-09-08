// ===============================================
// STOCK MARKET CALCULATOR SUITE - MAIN APP
// ===============================================

// Global Variables
let calculationHistory = [];
let portfolio = [];
let currentLanguage = 'en';
let charts = {};

// Translations
const translations = {
    en: {
        welcome: "Welcome to Stock Market Calculator",
        calculate: "Calculate",
        result: "Result",
        error: "Please enter valid values",
        // Add more translations
    },
    hi: {
        welcome: "स्टॉक मार्केट कैलकुलेटर में आपका स्वागत है",
        calculate: "गणना करें",
        result: "परिणाम",
        error: "कृपया मान्य मान दर्ज करें",
        // Add more translations
    },
    es: {
        welcome: "Bienvenido a la Calculadora del Mercado de Valores",
        calculate: "Calcular",
        result: "Resultado",
        error: "Por favor ingrese valores válidos",
        // Add more translations
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 1500);
    
    // Load saved data
    loadHistory();
    loadPortfolio();
    loadTheme();
    loadLanguage();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize charts
    initCharts();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js');
    }
}

// Event Listeners
function initEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Language Selector
    document.getElementById('languageSelect').addEventListener('change', function() {
        changeLanguage(this.value);
    });
    
    // FAB Menu
    document.getElementById('fabMain').addEventListener('click', function() {
        document.querySelector('.fab-menu').classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-plus');
    });
    
    // Keyboard Shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Tab Navigation
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Special handling for charts tab
    if (tabName === 'charts') {
        updateCharts();
    }
}

// Theme Management
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    const themeIcon = document.getElementById('themeIcon');
    
    if (isDark) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').classList.replace('fa-moon', 'fa-sun');
    }
}

// Language Management
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateUILanguage();
}

function loadLanguage() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        document.getElementById('languageSelect').value = savedLanguage;
        updateUILanguage();
    }
}

function updateUILanguage() {
    // Update UI elements with translations
    // This would be more comprehensive in a full implementation
    console.log('Language changed to:', currentLanguage);
}

// History Management
function saveToHistory(type, data) {
    const entry = {
        id: Date.now(),
        type: type,
        data: data,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
    
    calculationHistory.unshift(entry);
    
    // Keep only last 100 entries
    if (calculationHistory.length > 100) {
        calculationHistory = calculationHistory.slice(0, 100);
    }
    
    localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
    updateHistoryDisplay();
}

function loadHistory() {
    const saved = localStorage.getItem('calculationHistory');
    if (saved) {
        calculationHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<p class="text-center">No calculation history yet.</p>';
        return;
    }
    
    historyList.innerHTML = calculationHistory.map(entry => `
        <div class="history-item">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong>${entry.type}</strong>
                <small>${entry.date} ${entry.time}</small>
            </div>
            <p>${formatHistoryData(entry.type, entry.data)}</p>
        </div>
    `).join('');
}

function formatHistoryData(type, data) {
    // Format data based on calculator type
    switch(type) {
        case 'Price Change':
            return `Old: ₹${data.oldPrice}, New: ₹${data.newPrice}, Change: ${data.change}%`;
        case 'SIP':
            return `Monthly: ₹${data.monthly}, Years: ${data.years}, Total: ₹${data.total}`;
        case 'CAGR':
            return `Initial: ₹${data.initial}, Final: ₹${data.final}, CAGR: ${data.cagr}%`;
        default:
            return JSON.stringify(data);
    }
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all calculation history?')) {
        calculationHistory = [];
        localStorage.removeItem('calculationHistory');
        updateHistoryDisplay();
    }
}

function exportHistory() {
    if (calculationHistory.length === 0) {
        alert('No history to export');
        return;
    }
    
    // Create CSV content
    let csv = 'Type,Date,Time,Data\n';
    calculationHistory.forEach(entry => {
        csv += `"${entry.type}","${entry.date}","${entry.time}","${JSON.stringify(entry.data).replace(/"/g, '""')}"\n`;
    });
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculation_history_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Portfolio Management
function loadPortfolio() {
    const saved = localStorage.getItem('portfolio');
    if (saved) {
        portfolio = JSON.parse(saved);
        updatePortfolioDisplay();
    }
}

function savePortfolio() {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
}

function addPortfolioItem() {
    const symbol = prompt('Enter stock symbol:');
    if (!symbol) return;
    
    const quantity = parseFloat(prompt('Enter quantity:'));
    if (!quantity || isNaN(quantity)) return;
    
    const buyPrice = parseFloat(prompt('Enter buy price:'));
    if (!buyPrice || isNaN(buyPrice)) return;
    
    const currentPrice = parseFloat(prompt('Enter current price:'));
    if (!currentPrice || isNaN(currentPrice)) return;
    
    const item = {
        id: Date.now(),
        symbol: symbol.toUpperCase(),
        quantity: quantity,
        buyPrice: buyPrice,
        currentPrice: currentPrice,
        totalValue: quantity * currentPrice,
        totalCost: quantity * buyPrice,
        profit: (quantity * currentPrice) - (quantity * buyPrice),
        profitPercent: ((currentPrice - buyPrice) / buyPrice * 100).toFixed(2)
    };
    
    portfolio.push(item);
    savePortfolio();
    updatePortfolioDisplay();
}

function updatePortfolioDisplay() {
    const portfolioList = document.getElementById('portfolioList');
    const portfolioSummary = document.getElementById('portfolioSummary');
    
    if (portfolio.length === 0) {
        portfolioList.innerHTML = '<p class="text-center">No stocks in portfolio yet.</p>';
        portfolioSummary.innerHTML = '';
        return;
    }
    
    // Display portfolio items
    portfolioList.innerHTML = portfolio.map(item => `
        <div class="portfolio-item">
            <div>
                <strong>${item.symbol}</strong>
                <p>Qty: ${item.quantity} @ ₹${item.buyPrice}</p>
            </div>
            <div style="text-align: right;">
                <strong>₹${item.currentPrice}</strong>
                <p class="${item.profit >= 0 ? 'success' : 'danger'}">
                    ${item.profit >= 0 ? '+' : ''}₹${item.profit.toFixed(2)} (${item.profitPercent}%)
                </p>
            </div>
        </div>
    `).join('');
    
    // Calculate summary
    const totalValue = portfolio.reduce((sum, item) => sum + item.totalValue, 0);
    const totalCost = portfolio.reduce((sum, item) => sum + item.totalCost, 0);
    const totalProfit = totalValue - totalCost;
    const totalProfitPercent = ((totalProfit / totalCost) * 100).toFixed(2);
    
    portfolioSummary.innerHTML = `
        <div>
            <h4>Total Investment</h4>
            <p>₹${totalCost.toFixed(2)}</p>
        </div>
        <div>
            <h4>Current Value</h4>
            <p>₹${totalValue.toFixed(2)}</p>
        </div>
        <div>
            <h4>Total Profit/Loss</h4>
            <p class="${totalProfit >= 0 ? 'success' : 'danger'}">
                ${totalProfit >= 0 ? '+' : ''}₹${totalProfit.toFixed(2)}
            </p>
        </div>
        <div>
            <h4>Return %</h4>
            <p class="${totalProfit >= 0 ? 'success' : 'danger'}">
                ${totalProfitPercent}%
            </p>
        </div>
    `;
    
    // Update portfolio chart
    updatePortfolioChart();
}

// Chart Management
function initCharts() {
    // Initialize comparison chart
    const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
    charts.comparison = new Chart(comparisonCtx, {
        type: 'bar',
        data: {
            labels: ['SIP', 'SWP', 'Fixed Deposit', 'Gold', 'Real Estate'],
            datasets: [{
                label: 'Expected Returns (%)',
                data: [12, 8, 6, 10, 15],
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(124, 58, 237, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
    
    // Initialize growth chart
    const growthCtx = document.getElementById('growthChart').getContext('2d');
    charts.growth = new Chart(growthCtx, {
        type: 'line',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            datasets: [{
                label: 'Portfolio Growth',
                data: [100000, 112000, 125440, 140492, 157351],
                borderColor: 'rgba(79, 70, 229, 1)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

function updateCharts() {
    // Update charts with latest data
    Object.values(charts).forEach(chart => chart.update());
}

function updatePortfolioChart() {
    const ctx = document.getElementById('portfolioChart');
    if (!ctx || portfolio.length === 0) return;
    
    ctx.style.display = 'block';
    
    if (charts.portfolio) {
        charts.portfolio.destroy();
    }
    
    charts.portfolio = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: portfolio.map(item => item.symbol),
            datasets: [{
                data: portfolio.map(item => item.totalValue),
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(124, 58, 237, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--${type}-color);
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + combinations
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'd':
                e.preventDefault();
                toggleTheme();
                break;
            case 'e':
                e.preventDefault();
                exportHistory();
                break;
            case 'p':
                e.preventDefault();
                printResults();
                break;
            case 'h':
                e.preventDefault();
                switchTab('basic');
                break;
        }
    }
    
    // Alt + number for tab switching
    if (e.altKey && !isNaN(e.key)) {
        e.preventDefault();
        const tabs = ['basic', 'investment', 'analysis', 'risk', 'portfolio', 'charts'];
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < tabs.length) {
            switchTab(tabs[index]);
        }
    }
}

// Print Functionality
function printResults() {
    window.print();
}

// Share Functionality
function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'Stock Market Calculator Results',
            text: 'Check out my investment calculations!',
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link copied to clipboard!', 'success');
    }
}

// Show Keyboard Shortcuts
function showKeyboardShortcuts() {
    const shortcuts = `
        <h3>Keyboard Shortcuts</h3>
        <p><kbd>Ctrl</kbd> + <kbd>D</kbd> - Toggle Dark Mode</p>
        <p><kbd>Ctrl</kbd> + <kbd>E</kbd> - Export History</p>
        <p><kbd>Ctrl</kbd> + <kbd>P</kbd> - Print Results</p>
        <p><kbd>Ctrl</kbd> + <kbd>H</kbd> - Go to Home</p>
        <p><kbd>Alt</kbd> + <kbd>1-6</kbd> - Switch Tabs</p>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: var(--bg-primary); padding: 2rem; border-radius: 1rem; max-width: 400px; color: var(--text-primary);">
                ${shortcuts}
                <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Stock Entry Management
function addStockEntry() {
    const stockEntries = document.getElementById('stockEntries');
    const newEntry = document.createElement('div');
    newEntry.className = 'stock-entry';
    newEntry.innerHTML = `
        <div class="input-group">
            <label>Buy Price</label>
            <input type="number" class="avg-price" placeholder="Price" step="0.01">
        </div>
        <div class="input-group">
            <label>Quantity</label>
            <input type="number" class="avg-quantity" placeholder="Quantity">
        </div>
    `;
    stockEntries.appendChild(newEntry);
}

// Export functions to global scope
window.saveToHistory = saveToHistory;
window.clearHistory = clearHistory;
window.exportHistory = exportHistory;
window.addPortfolioItem = addPortfolioItem;
window.printResults = printResults;
window.shareResults = shareResults;
window.showKeyboardShortcuts = showKeyboardShortcuts;
window.addStockEntry = addStockEntry;
window.formatCurrency = formatCurrency;
window.showNotification = showNotification;
