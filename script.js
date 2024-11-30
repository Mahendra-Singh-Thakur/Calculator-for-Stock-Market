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

// Event Listeners
document.getElementById("calculateChange").addEventListener("click", calculatePercentageChange);
document.getElementById("applyChange").addEventListener("click", applyPercentageChange);
