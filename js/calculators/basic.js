// ===============================================
// BASIC CALCULATORS MODULE
// ===============================================

// Price Change Calculator
function calculatePriceChange() {
    const oldPrice = parseFloat(document.getElementById('oldPrice').value);
    const newPrice = parseFloat(document.getElementById('newPrice').value);
    
    if (!validateInputs([oldPrice, newPrice]) || oldPrice === 0) {
        showNotification('Please enter valid prices', 'danger');
        return;
    }
    
    const change = newPrice - oldPrice;
    const changePercent = ((change / oldPrice) * 100).toFixed(2);
    const isProfit = change >= 0;
    
    const resultHTML = `
        <h4>Price Change Analysis</h4>
        <p><strong>Old Price:</strong> ${formatCurrency(oldPrice)}</p>
        <p><strong>New Price:</strong> ${formatCurrency(newPrice)}</p>
        <p class="${isProfit ? 'success' : 'danger'}">
            <strong>Change:</strong> ${isProfit ? '+' : ''}${formatCurrency(change)} (${changePercent}%)
        </p>
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
            <p><strong>Analysis:</strong></p>
            <p>${Math.abs(changePercent) < 5 ? 'Minor price movement' : 
                Math.abs(changePercent) < 10 ? 'Moderate price movement' : 
                'Significant price movement'}</p>
            ${isProfit ? 
                `<p class="success">✓ Price increased by ${changePercent}%</p>` : 
                `<p class="danger">✗ Price decreased by ${Math.abs(changePercent)}%</p>`}
        </div>
    `;
    
    document.getElementById('priceChangeResult').innerHTML = resultHTML;
    
    // Save to history
    saveToHistory('Price Change', {
        oldPrice: oldPrice.toFixed(2),
        newPrice: newPrice.toFixed(2),
        change: changePercent
    });
    
    showNotification('Price change calculated successfully!', 'success');
}

// Profit/Loss Calculator with Tax and Brokerage
function calculateProfitLoss() {
    const buyPrice = parseFloat(document.getElementById('buyPrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const brokerage = parseFloat(document.getElementById('brokerage').value) || 0.03;
    
    if (!validateInputs([buyPrice, sellPrice, quantity])) {
        showNotification('Please enter valid values', 'danger');
        return;
    }
    
    // Calculate investment and sale values
    const investment = buyPrice * quantity;
    const saleValue = sellPrice * quantity;
    
    // Calculate brokerage
    const buyBrokerage = (investment * brokerage) / 100;
    const sellBrokerage = (saleValue * brokerage) / 100;
    const totalBrokerage = buyBrokerage + sellBrokerage;
    
    // Calculate other charges (approximate)
    const stt = saleValue * 0.001; // 0.1% on sell
    const transactionCharges = (investment + saleValue) * 0.00035; // 0.035%
    const gst = (totalBrokerage + transactionCharges) * 0.18; // 18% GST
    const sebiCharges = (investment + saleValue) * 0.000001; // ₹10 per crore
    const stampDuty = investment * 0.00015; // 0.015% on buy
    
    const totalCharges = totalBrokerage + stt + transactionCharges + gst + sebiCharges + stampDuty;
    
    // Calculate profit/loss
    const grossPL = saleValue - investment;
    const netPL = grossPL - totalCharges;
    const plPercent = ((netPL / investment) * 100).toFixed(2);
    const isProfit = netPL >= 0;
    
    // Calculate tax (simplified)
    let tax = 0;
    let taxType = '';
    const holdingDays = 365; // Assuming long term for now
    
    if (isProfit) {
        if (holdingDays > 365) {
            tax = netPL * 0.10; // 10% LTCG
            taxType = 'Long Term Capital Gains (10%)';
        } else {
            tax = netPL * 0.15; // 15% STCG
            taxType = 'Short Term Capital Gains (15%)';
        }
    }
    
    const finalPL = netPL - tax;
    
    const resultHTML = `
        <h4>Profit/Loss Analysis</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <p><strong>Buy Price:</strong></p><p>${formatCurrency(buyPrice)}</p>
            <p><strong>Sell Price:</strong></p><p>${formatCurrency(sellPrice)}</p>
            <p><strong>Quantity:</strong></p><p>${quantity}</p>
            <p><strong>Investment:</strong></p><p>${formatCurrency(investment)}</p>
            <p><strong>Sale Value:</strong></p><p>${formatCurrency(saleValue)}</p>
        </div>
        
        <h5 style="margin-top: 1rem;">Charges Breakdown</h5>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9rem;">
            <p>Brokerage:</p><p>${formatCurrency(totalBrokerage)}</p>
            <p>STT:</p><p>${formatCurrency(stt)}</p>
            <p>Transaction Charges:</p><p>${formatCurrency(transactionCharges)}</p>
            <p>GST:</p><p>${formatCurrency(gst)}</p>
            <p>Stamp Duty:</p><p>${formatCurrency(stampDuty)}</p>
            <p><strong>Total Charges:</strong></p><p><strong>${formatCurrency(totalCharges)}</strong></p>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${isProfit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border-radius: 0.5rem;">
            <p class="${isProfit ? 'success' : 'danger'}">
                <strong>Gross P/L:</strong> ${isProfit ? '+' : ''}${formatCurrency(grossPL)}
            </p>
            <p class="${isProfit ? 'success' : 'danger'}">
                <strong>Net P/L (after charges):</strong> ${isProfit ? '+' : ''}${formatCurrency(netPL)} (${plPercent}%)
            </p>
            ${isProfit ? `
                <p><strong>Tax (${taxType}):</strong> ${formatCurrency(tax)}</p>
                <p class="success"><strong>Final P/L (after tax):</strong> +${formatCurrency(finalPL)}</p>
            ` : ''}
        </div>
    `;
    
    document.getElementById('profitLossResult').innerHTML = resultHTML;
    
    // Save to history
    saveToHistory('Profit/Loss', {
        buyPrice: buyPrice.toFixed(2),
        sellPrice: sellPrice.toFixed(2),
        quantity: quantity,
        netPL: netPL.toFixed(2),
        plPercent: plPercent
    });
    
    showNotification('Profit/Loss calculated with all charges!', 'success');
}

// Validation Helper
function validateInputs(inputs) {
    return inputs.every(input => !isNaN(input) && input > 0);
}

// Export functions
window.calculatePriceChange = calculatePriceChange;
window.calculateProfitLoss = calculateProfitLoss;
