const axios = require('axios');

let stockPrice = 100.00;
let cash = 10000;
let shares = 0;
let tradeLog = [];
let balanceHistory = [];

const BUY_THRESHOLD = -0.02;
const SELL_THRESHOLD = 0.03;

function getStockPrice() {
    const priceChange = (Math.random() - 0.5) * 2;
    stockPrice += stockPrice * (priceChange / 100);
    return parseFloat(stockPrice.toFixed(2));
}

function makeTradeDecision(currentPrice, lastPrice) {
    const priceChange = (currentPrice - lastPrice) / lastPrice;

    if (priceChange <= BUY_THRESHOLD && cash >= currentPrice) {
        const sharesToBuy = Math.floor(cash / currentPrice);
        cash -= sharesToBuy * currentPrice;
        shares += sharesToBuy;
        tradeLog.push({ action: 'BUY', price: currentPrice, shares: sharesToBuy });
        console.log(`Bought ${sharesToBuy} shares at $${currentPrice}`);
    } else if (priceChange >= SELL_THRESHOLD && shares > 0) {
        const totalSale = shares * currentPrice;
        cash += totalSale;
        tradeLog.push({ action: 'SELL', price: currentPrice, shares });
        console.log(`Sold ${shares} shares at $${currentPrice}`);
        shares = 0;
    }

    balanceHistory.push({ cash, shares, currentPrice });
}

function calculateProfitLoss() {
    const totalAssets = cash + shares * stockPrice;
    const initialCash = 10000;
    const profitLoss = totalAssets - initialCash;
    console.log(`Final Balance: $${totalAssets.toFixed(2)}`);
    console.log(`Profit/Loss: $${profitLoss.toFixed(2)}`);
    console.log('Trade History:', tradeLog);
}

async function startTradingBot() {
    let lastPrice = stockPrice;

    for (let i = 0; i < 100; i++) {
        const currentPrice = getStockPrice();
        console.log(`Stock Price: $${currentPrice}`);
        makeTradeDecision(currentPrice, lastPrice);
        lastPrice = currentPrice;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    calculateProfitLoss();
    console.log('Trading session completed.');
}

startTradingBot();
