# Calculator for Stock Market 📈

A comprehensive financial calculator web application designed for stock market investors and traders. This tool provides multiple calculators to help with investment planning and analysis.

## 🚀 Features

### Calculators Available:

1. **Price Change Calculator** 
   - Calculate percentage change between old and new prices
   - Apply calculated percentage to any amount
   - Useful for tracking stock price movements

2. **SIP Calculator (Systematic Investment Plan)**
   - Calculate future value of monthly investments
   - Account for compound interest
   - Plan long-term investment strategies

3. **SWP Calculator (Systematic Withdrawal Plan)**
   - Calculate monthly withdrawal amounts
   - Determine how long your investment will last
   - Plan retirement withdrawals

4. **CAGR Calculator (Compound Annual Growth Rate)**
   - Calculate annual growth rate of investments
   - Compare investment performance
   - Project future values based on historical CAGR

### Additional Features:

- 🌙 **Dark Mode**: Toggle between light and dark themes with persistent storage
- 📊 **Calculation History**: Track all your calculations with timestamps
- 📱 **Mobile Responsive**: Fully responsive design for all devices
- 💾 **Local Storage**: Saves theme preference and calculation history
- 🇮🇳 **Indian Currency Format**: Results displayed in INR with proper formatting

## 🛠️ Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with flexbox and responsive design
- **JavaScript (ES6+)**: Interactive functionality and calculations
- **Local Storage API**: Data persistence

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Calculator-for-Stock-Market.git
```

2. Navigate to the project directory:
```bash
cd Calculator-for-Stock-Market
```

3. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## 💻 Usage

### Price Change Calculator
1. Enter the old price and new price
2. Click "Calculate Percentage Change"
3. Optionally apply the change to any amount

### SIP Calculator
1. Enter monthly investment amount
2. Enter expected annual return percentage
3. Enter investment duration in years
4. Click "Calculate SIP Value"

### SWP Calculator
1. Enter total investment amount
2. Enter expected annual return percentage
3. Enter withdrawal duration in years
4. Click "Calculate SWP Value"

### CAGR Calculator
1. Enter initial investment value
2. Enter final investment value
3. Enter number of years
4. Click "Calculate CAGR"

### Dark Mode
- Click the moon/sun icon in the top-right corner to toggle themes

### History
- Click "View History" to see past calculations
- Click "Clear History" to remove all saved calculations

## 📐 Formulas Used

### Percentage Change
```
Percentage Change = ((New Price - Old Price) / Old Price) × 100
```

### SIP Future Value
```
FV = P × [((1 + r)^n - 1) / r] × (1 + r)
Where:
- P = Monthly investment
- r = Monthly interest rate
- n = Number of months
```

### CAGR
```
CAGR = (Final Value / Initial Value)^(1/n) - 1
Where n = Number of years
```

## 🎨 Features in Development

- [ ] Export calculations to CSV/PDF
- [ ] More calculator types (P/E Ratio, Dividend Yield, etc.)
- [ ] Real-time stock price integration
- [ ] Graphical charts for visualizations
- [ ] Multi-currency support
- [ ] Advanced portfolio tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- Financial formulas from investopedia.com
- Icons and emojis from Unicode
- Inspiration from various financial calculator tools

---

⭐ Star this repository if you find it helpful!
