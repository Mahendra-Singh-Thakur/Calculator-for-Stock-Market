// ===============================================
// ALL CALCULATORS - COMPREHENSIVE MODULE
// ===============================================

// ========== INVESTMENT CALCULATORS ==========

// SIP Calculator with Chart
function calculateSIP() {
    const monthlyAmount = parseFloat(document.getElementById('sipAmount').value);
    const annualRate = parseFloat(document.getElementById('sipRate').value);
    const years = parseFloat(document.getElementById('sipYears').value);
    
    if (!validateInputs([monthlyAmount, annualRate, years])) {
        showNotification('Please enter valid values', 'danger');
        return;
    }
    
    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    
    let futureValue;
    if (monthlyRate === 0) {
        futureValue = monthlyAmount * months;
    } else {
        futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    }
    
    const totalInvested = monthlyAmount * months;
    const totalReturns = futureValue - totalInvested;
    
    // Generate chart data
    const chartLabels = [];
    const chartData = [];
    for (let year = 1; year <= years; year++) {
        chartLabels.push(`Year ${year}`);
        const monthsCalc = year * 12;
        const value = monthlyAmount * (((Math.pow(1 + monthlyRate, monthsCalc) - 1) / monthlyRate) * (1 + monthlyRate));
        chartData.push(value);
    }
    
    const resultHTML = `
        <h4>SIP Investment Results</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
                <p><strong>Monthly Investment:</strong></p>
                <p style="font-size: 1.2rem;">${formatCurrency(monthlyAmount)}</p>
            </div>
            <div>
                <p><strong>Investment Period:</strong></p>
                <p style="font-size: 1.2rem;">${years} years</p>
            </div>
            <div>
                <p><strong>Total Invested:</strong></p>
                <p style="font-size: 1.2rem;">${formatCurrency(totalInvested)}</p>
            </div>
            <div>
                <p><strong>Expected Returns:</strong></p>
                <p style="font-size: 1.2rem; color: var(--success-color);">${formatCurrency(totalReturns)}</p>
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: var(--gradient-success); color: white; border-radius: 0.5rem;">
            <p style="font-size: 1.5rem; margin: 0;"><strong>Maturity Value: ${formatCurrency(futureValue)}</strong></p>
        </div>
    `;
    
    document.getElementById('sipResult').innerHTML = resultHTML;
    
    // Create chart
    const ctx = document.getElementById('sipChart');
    ctx.style.display = 'block';
    
    if (window.sipChartInstance) {
        window.sipChartInstance.destroy();
    }
    
    window.sipChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Portfolio Value',
                data: chartData,
                borderColor: 'rgba(79, 70, 229, 1)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true }
            }
        }
    });
    
    saveToHistory('SIP', {
        monthly: monthlyAmount.toFixed(2),
        years: years,
        total: futureValue.toFixed(2)
    });
}

// SWP Calculator
function calculateSWP() {
    const totalAmount = parseFloat(document.getElementById('swpAmount').value);
    const annualRate = parseFloat(document.getElementById('swpRate').value);
    const years = parseFloat(document.getElementById('swpYears').value);
    
    if (!validateInputs([totalAmount, annualRate, years])) {
        showNotification('Please enter valid values', 'danger');
        return;
    }
    
    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    
    let monthlyWithdrawal;
    if (monthlyRate === 0) {
        monthlyWithdrawal = totalAmount / months;
    } else {
        monthlyWithdrawal = (totalAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                            (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    const totalWithdrawn = monthlyWithdrawal * months;
    const totalInterestEarned = totalWithdrawn - totalAmount;
    
    const resultHTML = `
        <h4>SWP Withdrawal Results</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
                <p><strong>Initial Investment:</strong></p>
                <p style="font-size: 1.2rem;">${formatCurrency(totalAmount)}</p>
            </div>
            <div>
                <p><strong>Monthly Withdrawal:</strong></p>
                <p style="font-size: 1.2rem; color: var(--info-color);">${formatCurrency(monthlyWithdrawal)}</p>
            </div>
            <div>
                <p><strong>Total Withdrawn:</strong></p>
                <p style="font-size: 1.2rem;">${formatCurrency(totalWithdrawn)}</p>
            </div>
            <div>
                <p><strong>Interest Earned:</strong></p>
                <p style="font-size: 1.2rem; color: var(--success-color);">${formatCurrency(totalInterestEarned)}</p>
            </div>
        </div>
    `;
    
    document.getElementById('swpResult').innerHTML = resultHTML;
    saveToHistory('SWP', {
        totalAmount: totalAmount.toFixed(2),
        monthlyWithdrawal: monthlyWithdrawal.toFixed(2),
        years: years
    });
}

// CAGR Calculator
function calculateCAGR() {
    const initialValue = parseFloat(document.getElementById('initialValue').value);
    const finalValue = parseFloat(document.getElementById('finalValue').value);
    const years = parseFloat(document.getElementById('cagrYears').value);
    
    if (!validateInputs([initialValue, finalValue, years])) {
        showNotification('Please enter valid values', 'danger');
        return;
    }
    
    const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
    const absoluteReturn = ((finalValue - initialValue) / initialValue) * 100;
    const totalGain = finalValue - initialValue;
    
    const resultHTML = `
        <h4>CAGR Analysis</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
                <p><strong>Initial Value:</strong></p>
                <p>${formatCurrency(initialValue)}</p>
            </div>
            <div>
                <p><strong>Final Value:</strong></p>
                <p>${formatCurrency(finalValue)}</p>
            </div>
            <div>
                <p><strong>Time Period:</strong></p>
                <p>${years} years</p>
            </div>
            <div>
                <p><strong>Total Gain:</strong></p>
                <p class="${totalGain >= 0 ? 'success' : 'danger'}">${formatCurrency(totalGain)}</p>
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: var(--gradient-primary); color: white; border-radius: 0.5rem;">
            <p style="font-size: 1.5rem; margin: 0;"><strong>CAGR: ${cagr.toFixed(2)}%</strong></p>
            <p style="margin: 0.5rem 0 0;">Absolute Return: ${absoluteReturn.toFixed(2)}%</p>
        </div>
    `;
    
    document.getElementById('cagrResult').innerHTML = resultHTML;
    saveToHistory('CAGR', {
        initial: initialValue.toFixed(2),
        final: finalValue.toFixed(2),
        cagr: cagr.toFixed(2)
    });
}

// ========== ANALYSIS CALCULATORS ==========

// P/E Ratio Calculator
function calculatePERatio() {
    const stockPrice = parseFloat(document.getElementById('stockPrice').value);
    const eps = parseFloat(document.getElementById('eps').value);
    
    if (!validateInputs([stockPrice, eps]) || eps === 0) {
        showNotification('Please enter valid values', 'danger');
        return;
    }
    
    const peRatio = stockPrice / eps;
    let valuation = '';
    
    if (peRatio < 15) valuation = 'Undervalued';
    else if (peRatio < 25) valuation = 'Fairly Valued';
    else valuation = 'Overvalued';
    
    const resultHTML = `
        <h4>P/E Ratio Analysis</h4>
        <p><strong>Stock Price:</strong> ${formatCurrency(stockPrice)}</p>
        <p><strong>EPS:</strong> ${formatCurrency(eps)}</p>
        <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: 0.5rem;">
            <p style="font-size: 1.3rem;"><strong>P/E Ratio: ${peRatio.toFixed(2)}</strong></p>
            <p><strong>Valuation:</strong> <span class="${peRatio < 25 ? 'success' : 'warning'}">${valuation}</span></p>
        </div>
    `;
    
    document.getElementById('peRatioResult').innerHTML = resultHTML;
    saveToHistory('P/E Ratio', { stockPrice, eps, peRatio: peRatio.toFixed(2) });
}

// Dividend Yield Calculator
function calculateDividendYield() {
    const annualDividend = parseFloat(document.getElementById('annualDividend').value);
    const currentPrice = parseFloat(document.getElementById('currentPrice').value);
    
    if (!validateInputs([annualDividend, currentPrice]) || currentPrice === 0) {
        showNotification('Please enter valid values', 'danger');
        return;
    }
    
    const dividendYield = (annualDividend / currentPrice) * 100;
    
    const resultHTML = `
        <h4>Dividend Yield Analysis</h4>
        <p><strong>Annual Dividend:</strong> ${formatCurrency(annualDividend)}</p>
        <p><strong>Current Price:</strong> ${formatCurrency(currentPrice)}</p>
        <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: 0.5rem;">
            <p style="font-size: 1.3rem;"><strong>Dividend Yield: ${dividendYield.toFixed(2)}%</strong></p>
            <p>${dividendYield > 4 ? '✓ Good dividend yield' : dividendYield > 2 ? '✓ Moderate dividend yield' : '✗ Low dividend yield'}</p>
        </div>
    `;
    
    document.getElementById('dividendYieldResult').innerHTML = resultHTML;
    saveToHistory('Dividend Yield', { annualDividend, currentPrice, yield: dividendYield.toFixed(2) });
}

// Stock Average Calculator
function calculateAverage() {
    const prices = Array.from(document.querySelectorAll('.avg-price')).map(el => parseFloat(el.value));
    const quantities = Array.from(document.querySelectorAll('.avg-quantity')).map(el => parseInt(el.value));
    
    if (prices.some(p => isNaN(p) || p <= 0) || quantities.some(q => isNaN(q) || q <= 0)) {
        showNotification('Please enter valid values for all entries', 'danger');
        return;
    }
    
    const totalQuantity = quantities.reduce((sum, q) => sum + q, 0);
    const totalCost = prices.reduce((sum, price, index) => sum + (price * quantities[index]), 0);
    const averagePrice = totalCost / totalQuantity;
    
    const resultHTML = `
        <h4>Average Price Calculation</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
                <p><strong>Total Quantity:</strong></p>
                <p style="font-size: 1.2rem;">${totalQuantity}</p>
            </div>
            <div>
                <p><strong>Total Investment:</strong></p>
                <p style="font-size: 1.2rem;">${formatCurrency(totalCost)}</p>
            </div>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: var(--gradient-primary); color: white; border-radius: 0.5rem;">
            <p style="font-size: 1.5rem; margin: 0;"><strong>Average Price: ${formatCurrency(averagePrice)}</strong></p>
        </div>
    `;
    
    document.getElementById('stockAverageResult').innerHTML = resultHTML;
    saveToHistory('Stock Average', { totalQuantity, totalCost: totalCost.toFixed(2), averagePrice: averagePrice.toFixed(2) });
}

// ========== RISK MANAGEMENT CALCULATORS ==========

// Risk-Reward Calculator
function calculateRiskReward() {
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const stopLoss = parseFloat(document.getElementById('stopLoss').value);
    const target = parseFloat(document.getElementById('target').value);
    
    if (!validateInputs([entryPrice, stopLoss, target])) {
        showNotification('Please enter valid values', 'danger');
        return;
    }
    
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(target - entryPrice);
    const ratio = reward / risk;
    const riskPercent = (risk / entryPrice) * 100;
    const rewardPercent = (reward / entryPrice) * 100;
    
    const isGoodRatio = ratio >= 2;
    
    const resultHTML = `
        <h4>Risk-Reward Analysis</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <p><strong>Entry Price:</strong></p><p>${formatCurrency(entryPrice)}</p>
            <p><strong>Stop Loss:</strong></p><p class="danger">${formatCurrency(stopLoss)}</p>
            <p><strong>Target:</strong></p><p class="success">${formatCurrency(target)}</p>
            <p><strong>Risk Amount:</strong></p><p class="danger">${formatCurrency(risk)}</p>
            <p><strong>Reward Amount:</strong></p><p class="success">${formatCurrency(reward)}</p>
            <p><strong>Risk %:</strong></p><p class="danger">${riskPercent.toFixed(2)}%</p>
            <p><strong>Reward %:</strong></p><p class="success">${rewardPercent.toFixed(2)}%</p>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: ${isGoodRatio ? 'var(--gradient-success)' : 'var(--gradient-secondary)'}; color: white; border-radius: 0.5rem;">
            <p style="font-size: 1.5rem; margin: 0;"><strong>Risk:Reward = 1:${ratio.toFixed(2)}</strong></p>
            <p style="margin: 0.5rem 0 0;">${isGoodRatio ? '✓ Good risk-reward ratio' : '⚠ Consider improving risk-reward ratio'}</p>
        </div>
    `;
    
    document.getElementById('riskRewardResult').innerHTML = resultHTML;
    saveToHistory('Risk-Reward', { entryPrice, stopLoss, target, ratio: ratio.toFixed(2) });
}

// Position Size Calculator
function calculatePositionSize() {
    const accountSize = parseFloat(document.getElementById('accountSize').value);
    const riskPercent = parseFloat(document.getElementById('riskPercent').value);
    const entryPrice = parseFloat(document.getElementById('entryPricePos').value);
    const stopLoss = parseFloat(document.getElementById('stopLossPos').value);
    
    if (!validateInputs([accountSize, riskPercent, entryPrice, stopLoss])) {
        showNotification('Please enter valid values', 'danger');
        return;
    }
    
    const riskAmount = (accountSize * riskPercent) / 100;
    const riskPerShare = Math.abs(entryPrice - stopLoss);
    const positionSize = Math.floor(riskAmount / riskPerShare);
    const totalInvestment = positionSize * entryPrice;
    const percentOfAccount = (totalInvestment / accountSize) * 100;
    
    const resultHTML = `
        <h4>Position Size Calculation</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <p><strong>Account Size:</strong></p><p>${formatCurrency(accountSize)}</p>
            <p><strong>Risk per Trade:</strong></p><p>${riskPercent}% (${formatCurrency(riskAmount)})</p>
            <p><strong>Entry Price:</strong></p><p>${formatCurrency(entryPrice)}</p>
            <p><strong>Stop Loss:</strong></p><p>${formatCurrency(stopLoss)}</p>
            <p><strong>Risk per Share:</strong></p><p>${formatCurrency(riskPerShare)}</p>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: var(--gradient-primary); color: white; border-radius: 0.5rem;">
            <p style="font-size: 1.3rem;"><strong>Position Size: ${positionSize} shares</strong></p>
            <p>Total Investment: ${formatCurrency(totalInvestment)}</p>
            <p>% of Account: ${percentOfAccount.toFixed(2)}%</p>
            <p>Max Loss: ${formatCurrency(riskAmount)}</p>
        </div>
    `;
    
    document.getElementById('positionSizeResult').innerHTML = resultHTML;
    saveToHistory('Position Size', { accountSize, riskPercent, positionSize, totalInvestment: totalInvestment.toFixed(2) });
}

// Margin Calculator
function calculateMargin() {
    const stockPrice = parseFloat(document.getElementById('marginStockPrice').value);
    const quantity = parseInt(document.getElementById('marginQuantity').value);
    const marginPercent = parseFloat(document.getElementById('marginPercent').value);
    
    if (!validateInputs([stockPrice, quantity, marginPercent])) {
        showNotification('Please enter valid values', 'danger');
        return;
    }
    
    const totalValue = stockPrice * quantity;
    const marginRequired = (totalValue * marginPercent) / 100;
    const leverage = 100 / marginPercent;
    const breakEven = stockPrice * (1 + (marginPercent / 100 * 0.01)); // Approximate with interest
    
    const resultHTML = `
        <h4>Margin Requirements</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <p><strong>Stock Price:</strong></p><p>${formatCurrency(stockPrice)}</p>
            <p><strong>Quantity:</strong></p><p>${quantity}</p>
            <p><strong>Total Position Value:</strong></p><p>${formatCurrency(totalValue)}</p>
            <p><strong>Margin %:</strong></p><p>${marginPercent}%</p>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: var(--gradient-secondary); color: white; border-radius: 0.5rem;">
            <p style="font-size: 1.3rem;"><strong>Margin Required: ${formatCurrency(marginRequired)}</strong></p>
            <p>Leverage: ${leverage.toFixed(2)}x</p>
            <p>Break-even Price: ${formatCurrency(breakEven)}</p>
        </div>
        <div style="margin-top: 1rem; padding: 0.5rem; background: rgba(239, 68, 68, 0.1); border-radius: 0.5rem;">
            <p class="warning"><strong>⚠ Risk Warning:</strong> Trading on margin amplifies both gains and losses.</p>
        </div>
    `;
    
    document.getElementById('marginResult').innerHTML = resultHTML;
    saveToHistory('Margin', { stockPrice, quantity, marginRequired: marginRequired.toFixed(2), leverage: leverage.toFixed(2) });
}

// Validation Helper
function validateInputs(inputs) {
    return inputs.every(input => !isNaN(input) && input > 0);
}

// Export all calculator functions to global scope
window.calculateSIP = calculateSIP;
window.calculateSWP = calculateSWP;
window.calculateCAGR = calculateCAGR;
window.calculatePERatio = calculatePERatio;
window.calculateDividendYield = calculateDividendYield;
window.calculateAverage = calculateAverage;
window.calculateRiskReward = calculateRiskReward;
window.calculatePositionSize = calculatePositionSize;
window.calculateMargin = calculateMargin;
