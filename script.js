// History Management Functions
function saveToHistory(type, data) {
    const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    const timestamp = new Date().toLocaleString('en-IN');
    
    const entry = {
        type,
        data,
        timestamp,
        id: Date.now()
    };
    
    history.unshift(entry); // Add to beginning
    
    // Keep only last 50 entries
    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem('calculationHistory', JSON.stringify(history));
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    const outputDiv = document.getElementById('historyOutput');
    
    if (history.length === 0) {
        outputDiv.innerHTML = '<p style="text-align: center; color: #666;">No calculation history available.</p>';
        return;
    }
    
    let historyHTML = '<div style="max-height: 400px; overflow-y: auto;">';
    
    history.forEach(entry => {
        let details = '';
        
        switch(entry.type) {
            case 'Price Change':
                details = `Old: ₹${entry.data.oldPrice}, New: ₹${entry.data.newPrice}, Change: ${entry.data.percentageChange}%`;
                break;
            case 'SIP':
                details = `Monthly: ₹${entry.data.monthlyAmount}, Duration: ${entry.data.years}y, Total: ₹${entry.data.futureValue}`;
                break;
            case 'SWP':
                details = `Initial: ₹${entry.data.totalAmount}, Monthly: ₹${entry.data.monthlyWithdrawal}, Duration: ${entry.data.years}y`;
                break;
            case 'CAGR':
                details = `Initial: ₹${entry.data.initialValue}, Final: ₹${entry.data.finalValue}, CAGR: ${entry.data.cagr}%`;
                break;
        }
        
        historyHTML += `
            <div style="background: #f9f9f9; padding: 10px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #4CAF50;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${entry.type}</strong>
                    <small style="color: #666;">${entry.timestamp}</small>
                </div>
                <p style="margin: 5px 0; color: #444;">${details}</p>
            </div>
        `;
    });
    
    historyHTML += '</div>';
    outputDiv.innerHTML = historyHTML;
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all calculation history?')) {
        localStorage.removeItem('calculationHistory');
        document.getElementById('historyOutput').innerHTML = '<p style="text-align: center; color: #666;">History cleared.</p>';
    }
}

// Function to calculate percentage change
function calculatePercentageChange() {
    const oldPrice = parseFloat(document.getElementById("oldPrice").value);
    const newPrice = parseFloat(document.getElementById("newPrice").value);
    const outputDiv = document.getElementById("output1");
    const outputDiv2 = document.getElementById("output2");

    if (isNaN(oldPrice) || isNaN(newPrice) || oldPrice === 0) {
        outputDiv.innerHTML = "<p style='color: red;'>Please enter valid prices and ensure old price is not zero.</p>";
        return;
    }
    const percentageChange = ((newPrice - oldPrice) / oldPrice) * 100;
    outputDiv.innerHTML = `<p>Percentage Change: <strong>${percentageChange.toFixed(2)}%</strong></p>`;
    outputDiv2.innerHTML = ``;
    // Show the additional calculation form
    document.getElementById("additionalForm").style.display = "block";

    // Save the percentage change for further calculations
    document.getElementById("additionalForm").dataset.percentageChange = percentageChange;
    
    // Save to history
    saveToHistory('Price Change', {
        oldPrice: oldPrice.toFixed(2),
        newPrice: newPrice.toFixed(2),
        percentageChange: percentageChange.toFixed(2)
    });
}

// Function to apply percentage change to an amount
function applyPercentageChange() {
    const amount = parseFloat(document.getElementById("amount").value);
    const outputDiv = document.getElementById("output2");
    const percentageChange = parseFloat(document.getElementById("additionalForm").dataset.percentageChange);
    if (isNaN(amount)) {
        outputDiv.innerHTML += "<p style='color: red;'>Please enter a valid amount.</p>";
        return;
    }

    const addedAmount = (amount * percentageChange) / 100;
    const totalAmount = amount + addedAmount;

    outputDiv.innerHTML += `<p>Total Amount: <strong>${totalAmount.toFixed(2)}</strong></p>`;
    outputDiv.innerHTML += `<p>Added Amount: <strong>${addedAmount.toFixed(2)}</strong></p>`;
}

// SIP Calculator Function
function calculateSIP() {
    const monthlyAmount = parseFloat(document.getElementById("sipAmount").value);
    const annualRate = parseFloat(document.getElementById("sipRate").value);
    const years = parseFloat(document.getElementById("sipDuration").value);
    const outputDiv = document.getElementById("sipOutput");

    if (isNaN(monthlyAmount) || isNaN(annualRate) || isNaN(years) || monthlyAmount <= 0 || years <= 0) {
        outputDiv.innerHTML = "<p style='color: red;'>Please enter valid values for all fields.</p>";
        return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    
    // Future Value of SIP formula: FV = P * [(1 + r)^n - 1] / r * (1 + r)
    let futureValue;
    if (monthlyRate === 0) {
        futureValue = monthlyAmount * months;
    } else {
        futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    }
    
    const totalInvested = monthlyAmount * months;
    const totalReturns = futureValue - totalInvested;
    
    outputDiv.innerHTML = `
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #2c5282; margin-bottom: 10px;">SIP Results</h3>
            <p><strong>Monthly Investment:</strong> ₹${monthlyAmount.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            <p><strong>Total Amount Invested:</strong> ₹${totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            <p><strong>Expected Returns:</strong> ₹${totalReturns.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            <p style="font-size: 1.2em; color: #2c5282;"><strong>Total Value:</strong> ₹${futureValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
        </div>
    `;
    
    // Save to history
    saveToHistory('SIP', {
        monthlyAmount: monthlyAmount.toFixed(2),
        years: years,
        futureValue: futureValue.toFixed(2)
    });
}

// SWP Calculator Function
function calculateSWP() {
    const totalAmount = parseFloat(document.getElementById("swpAmount").value);
    const annualRate = parseFloat(document.getElementById("swpRate").value);
    const years = parseFloat(document.getElementById("swpDuration").value);
    const outputDiv = document.getElementById("swpOutput");

    if (isNaN(totalAmount) || isNaN(annualRate) || isNaN(years) || totalAmount <= 0 || years <= 0) {
        outputDiv.innerHTML = "<p style='color: red;'>Please enter valid values for all fields.</p>";
        return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    
    // Calculate monthly withdrawal amount using annuity formula
    let monthlyWithdrawal;
    if (monthlyRate === 0) {
        monthlyWithdrawal = totalAmount / months;
    } else {
        monthlyWithdrawal = (totalAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                            (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    const totalWithdrawn = monthlyWithdrawal * months;
    const totalInterestEarned = totalWithdrawn - totalAmount;
    
    // Calculate remaining balance (should be close to 0 for full withdrawal)
    let remainingBalance = totalAmount;
    for (let i = 0; i < months; i++) {
        remainingBalance = remainingBalance * (1 + monthlyRate) - monthlyWithdrawal;
    }
    remainingBalance = Math.max(0, remainingBalance);
    
    outputDiv.innerHTML = `
        <div style="background: #fff5f5; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #742a2a; margin-bottom: 10px;">SWP Results</h3>
            <p><strong>Initial Investment:</strong> ₹${totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            <p><strong>Monthly Withdrawal:</strong> ₹${monthlyWithdrawal.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            <p><strong>Total Amount Withdrawn:</strong> ₹${totalWithdrawn.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            <p><strong>Interest Earned:</strong> ₹${totalInterestEarned.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            <p style="font-size: 1.2em; color: #742a2a;"><strong>Final Balance:</strong> ₹${remainingBalance.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
        </div>
    `;
    
    // Save to history
    saveToHistory('SWP', {
        totalAmount: totalAmount.toFixed(2),
        monthlyWithdrawal: monthlyWithdrawal.toFixed(2),
        years: years
    });
}

// CAGR Calculator Function
function calculateCAGR() {
    const initialValue = parseFloat(document.getElementById("initialValue").value);
    const finalValue = parseFloat(document.getElementById("finalValue").value);
    const years = parseFloat(document.getElementById("cagrYears").value);
    const outputDiv = document.getElementById("cagrOutput");

    if (isNaN(initialValue) || isNaN(finalValue) || isNaN(years) || initialValue <= 0 || finalValue <= 0 || years <= 0) {
        outputDiv.innerHTML = "<p style='color: red;'>Please enter valid positive values for all fields.</p>";
        return;
    }

    // CAGR Formula: CAGR = (FV/PV)^(1/n) - 1
    const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
    const absoluteReturn = ((finalValue - initialValue) / initialValue) * 100;
    const totalGain = finalValue - initialValue;
    
    // Calculate what the value would be for different time periods
    const value1Year = initialValue * Math.pow(1 + cagr/100, 1);
    const value3Years = initialValue * Math.pow(1 + cagr/100, 3);
    const value5Years = initialValue * Math.pow(1 + cagr/100, 5);
    const value10Years = initialValue * Math.pow(1 + cagr/100, 10);
    
    outputDiv.innerHTML = `
        <div style="background: #f0fff4; padding: 15px; border-radius: 8px; margin-top: 20px; border: 2px solid #38a169;">
            <h3 style="color: #22543d; margin-bottom: 10px;">CAGR Results</h3>
            <p><strong>Initial Value:</strong> ₹${initialValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            <p><strong>Final Value:</strong> ₹${finalValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            <p><strong>Time Period:</strong> ${years} years</p>
            <p><strong>Total Gain:</strong> ₹${totalGain.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            <p><strong>Absolute Return:</strong> ${absoluteReturn.toFixed(2)}%</p>
            <p style="font-size: 1.3em; color: #22543d; margin-top: 10px;"><strong>CAGR:</strong> ${cagr.toFixed(2)}%</p>
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #38a169;">
                <h4 style="color: #22543d;">Future Projections at ${cagr.toFixed(2)}% CAGR:</h4>
                <p><small>After 1 year: ₹${value1Year.toLocaleString('en-IN', {maximumFractionDigits: 2})}</small></p>
                <p><small>After 3 years: ₹${value3Years.toLocaleString('en-IN', {maximumFractionDigits: 2})}</small></p>
                <p><small>After 5 years: ₹${value5Years.toLocaleString('en-IN', {maximumFractionDigits: 2})}</small></p>
                <p><small>After 10 years: ₹${value10Years.toLocaleString('en-IN', {maximumFractionDigits: 2})}</small></p>
            </div>
        </div>
    `;
    
    // Save to history
    saveToHistory('CAGR', {
        initialValue: initialValue.toFixed(2),
        finalValue: finalValue.toFixed(2),
        cagr: cagr.toFixed(2)
    });
}

// Dark Mode Toggle Function
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
}

// Event Listeners
document.getElementById("calculateChange").addEventListener("click", calculatePercentageChange);
document.getElementById("applyChange").addEventListener("click", applyPercentageChange);
document.getElementById("calculateSIP").addEventListener("click", calculateSIP);
document.getElementById("calculateSWP").addEventListener("click", calculateSWP);
document.getElementById("calculateCAGR").addEventListener("click", calculateCAGR);
document.getElementById("viewHistory").addEventListener("click", displayHistory);
document.getElementById("clearHistory").addEventListener("click", clearHistory);

// Initialize dark mode when page loads
document.addEventListener('DOMContentLoaded', initDarkMode);
