const BASE_URL = "http://localhost:3000"; // backend server

// Currency conversion rates (relative to USD)
const CONVERSION_RATES = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.5,
    INR: 83.2,
    CNY: 7.24,
    AUD: 1.52,
    CAD: 1.36
};

const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    INR: '₹',
    CNY: '¥',
    AUD: 'A$',
    CAD: 'C$'
};

let expenses = [];
let lineChartInstance, pieChartInstance;

// Global Sort State for the Expense List (Default is 'date' descending)
let sortField = 'date'; // 'date', 'convertedAmount', or 'category'
let sortDirection = 'desc'; // 'asc' or 'desc'

// GLOBAL STATE FOR DATE FILTER (New)
let filterDateFrom = null; 
let filterDateTo = null;


// ======================= 🧠 DATABASE CONNECTION HELPERS =======================

async function loadExpensesFromDB() {
    try {
        const res = await fetch(`${BASE_URL}/expenses`);
        expenses = await res.json();
        console.log("✅ Expenses loaded from DB:", expenses);
        updateDisplay();
    } catch (err) {
        console.error("❌ Error fetching expenses from DB:", err);
    }
}

async function addExpenseToDB(expense) {
    try {
        const res = await fetch(`${BASE_URL}/expenses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense)
        });
        const data = await res.json();
        console.log("✅ Expense added to DB:", data);
    } catch (err) {
        console.error("❌ Error adding expense:", err);
    }
}

async function deleteExpenseFromDB(id) {
    try {
        await fetch(`${BASE_URL}/expenses/${id}`, { method: "DELETE" });
        console.log("🗑️ Expense deleted:", id);
    } catch (err) {
        console.error("❌ Error deleting expense:", err);
    }
}

// ======================= ⚙️ FRONTEND LOGIC =======================

function initializeListeners() {
    document.getElementById('displayCurrency').addEventListener('change', updateDisplay);
    document.getElementById('groupingPeriod').addEventListener('change', updateDisplay);
    document.getElementById('expenseForm').addEventListener('submit', addExpense);

    // Listener for sorting the expenses list (date is default)
    document.getElementById('sortField').addEventListener('change', (e) => {
        sortField = e.target.value;
        updateDisplay();
    });
    
    // LISTENERS FOR DATE FILTER (New)
    document.getElementById('applyDateFilterBtn').addEventListener('click', applyDateFilter);
    document.getElementById('resetDateFilterBtn').addEventListener('click', resetDateFilter);
    

    document.getElementById('date').valueAsDate = new Date();

    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) event.target.classList.remove('active');
    };
}

// --- Modal Functions ---
function openExpenseModal() {
    document.getElementById('expenseModal').classList.add('active');
    document.getElementById('date').valueAsDate = new Date();
}

function openConverterModal() {
    document.getElementById('converterModal').classList.add('active');
    document.getElementById('conversionResult').innerHTML = '';
}

// --- NEW Download Modal Function ---
function openDownloadModal() {
    document.getElementById('downloadModal').classList.add('active');
    // Pre-fill 'To' date with today's date
    document.getElementById('downloadDateFrom').value = '';
    document.getElementById('downloadDateTo').value = new Date().toISOString().split('T')[0];
    document.getElementById('downloadMessage').textContent = '';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'expenseModal') document.getElementById('expenseForm').reset();
}

// --- Add Expense ---
async function addExpense(e) {
    e.preventDefault();

    const expense = {
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value,
        currency: document.getElementById('expenseCurrency').value
    };

    if (isNaN(expense.amount) || expense.amount <= 0) {
        alert("Please enter a valid expense amount.");
        return;
    }
    if (expense.category === "") {
        alert("Please select an expense category.");
        return;
    }

    await addExpenseToDB(expense);
    closeModal('expenseModal');
    await loadExpensesFromDB(); // reload from DB
}

// --- Delete Expense ---
async function deleteExpense(idToDelete) {
    await deleteExpenseFromDB(idToDelete);
    await loadExpensesFromDB();
}

// ======================= 💱 CURRENCY CONVERSION =======================

function convertCurrency() {
    const amount = parseFloat(document.getElementById('converterAmount').value);
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;

    if (isNaN(amount) || amount <= 0) {
        document.getElementById('conversionResult').innerHTML = '<p class="no-data">Please enter a valid amount to convert.</p>';
        return;
    }

    const fromRate = CONVERSION_RATES[from];
    const toRate = CONVERSION_RATES[to];
    const result = (amount / fromRate) * toRate;
    const symbol = CURRENCY_SYMBOLS[to];

    document.getElementById('conversionResult').innerHTML = `
        <div class="conversion-result">
            <strong>Result:</strong>
            <span class="result-value">${symbol} ${result.toFixed(2)}</span>
        </div>
    `;
}

function convertAmount(amount, fromCurrency, toCurrency) {
    const fromRate = CONVERSION_RATES[fromCurrency];
    const toRate = CONVERSION_RATES[toCurrency];
    return (amount / fromRate) * toRate;
}

/**
 * Toggles the sort direction (ascending/descending) for the expense list 
 * and updates the arrow button.
 */
function toggleSortDirection() {
    const btn = document.getElementById('sortDirectionBtn');
    if (sortDirection === 'desc') {
        sortDirection = 'asc';
        btn.textContent = '▲'; // Up arrow for ascending
    } else {
        sortDirection = 'desc';
        btn.textContent = '🔽'; // Down arrow for descending
    }
    updateDisplay();
}

// ======================= 📅 DATE FILTER LOGIC =======================

function applyDateFilter() {
    const from = document.getElementById('filterDateFrom').value;
    const to = document.getElementById('filterDateTo').value;

    // Set global state based on input values (or null if empty)
    filterDateFrom = from || null; 
    filterDateTo = to || null;

    if (filterDateFrom && filterDateTo && filterDateFrom > filterDateTo) {
        alert("The 'Date From' cannot be after the 'Date To'.");
        // Reset the filter state and inputs if validation fails
        resetDateFilter();
        return;
    }
    
    // Re-render the entire display with the new filter applied
    updateDisplay();
}

function resetDateFilter() {
    filterDateFrom = null;
    filterDateTo = null;
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    updateDisplay();
}

/**
 * Filters the global expenses array based on the current date range filter state (for display).
 * @returns {Array} The filtered subset of expenses.
 */
function getFilteredExpenses() {
    return filterExpensesByDate(expenses, filterDateFrom, filterDateTo);
}

/**
 * Helper to filter a list of expenses based on a date range.
 */
function filterExpensesByDate(expenseList, from, to) {
    if (!from && !to) {
        return expenseList; // No filter applied
    }
    
    return expenseList.filter(exp => {
        const expenseDate = exp.date; // YYYY-MM-DD string format
        
        let isAfterFrom = true;
        if (from) {
            isAfterFrom = expenseDate >= from;
        }
        
        let isBeforeTo = true;
        if (to) {
            isBeforeTo = expenseDate <= to;
        }
        
        return isAfterFrom && isBeforeTo;
    });
}


// ======================= ⬇️ PDF DOWNLOAD LOGIC (NEW) =======================

async function downloadExpensesAsPdf() {
    // Check if jsPDF is loaded
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        alert("PDF library not loaded. Please ensure you have an internet connection.");
        return;
    }

    const fromDate = document.getElementById('downloadDateFrom').value;
    const toDate = document.getElementById('downloadDateTo').value;
    const displayCurrency = document.getElementById('displayCurrency').value;
    const symbol = CURRENCY_SYMBOLS[displayCurrency];
    const messageElement = document.getElementById('downloadMessage');
    
    messageElement.textContent = "Generating PDF...";

    // 1. Get filtered and converted data using the modal's dates
    const filteredRawExpenses = filterExpensesByDate(expenses, fromDate, toDate);
    
    if (filteredRawExpenses.length === 0) {
        messageElement.textContent = "No expenses found for this date range. Please adjust dates.";
        return;
    }

    const convertedExpenses = filteredRawExpenses.map(exp => ({
        ...exp,
        convertedAmount: convertAmount(exp.amount, exp.currency || 'INR', displayCurrency),
    }));

    // 2. Prepare PDF content (Table Headers and Body)
    const headers = [
        ['Date', 'Category', 'Description', 'Original Amount', `Amount (${displayCurrency})`]
    ];
    
    const body = convertedExpenses.map(exp => [
        exp.date,
        exp.category,
        exp.description,
        `${CURRENCY_SYMBOLS[exp.currency]} ${exp.amount.toFixed(2)}`,
        `${symbol} ${exp.convertedAmount.toFixed(2)}`
    ]);

    // Calculate total
    const total = convertedExpenses.reduce((sum, exp) => sum + exp.convertedAmount, 0);

    // 3. Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const dateRangeText = (fromDate || "All time") + " to " + (toDate || "Today");

    // Title
    doc.setFontSize(18);
    doc.text("Expense Tracker Report", 14, 20);
    
    // Date Range Info
    doc.setFontSize(11);
    doc.text(`Report Period: ${dateRangeText}`, 14, 28);
    doc.text(`Display Currency: ${displayCurrency}`, 14, 34);

    // AutoTable for Expense Data
    doc.autoTable({
        startY: 40,
        head: headers,
        body: body,
        theme: 'striped',
        headStyles: { fillColor: [102, 126, 234] }, // Blueish color
        styles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 20 },
            4: { halign: 'right' } // Align currency column right
        }
    });
    
    // Get the final Y position after the table
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Total Summary
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Expenses (${displayCurrency}): ${symbol} ${total.toFixed(2)}`, 14, finalY);
    doc.setFont(undefined, 'normal'); // Reset font style

    // 4. Download the PDF
    const filename = `ExpenseReport_${fromDate || 'all'}_to_${toDate || 'today'}.pdf`;
    doc.save(filename);
    
    messageElement.textContent = "✅ PDF Download Complete!";
    setTimeout(() => {
        closeModal('downloadModal');
        messageElement.textContent = '';
    }, 1500);
}

// ======================= 📊 UI RENDERING & CHART LOGIC (Unchanged) =======================

// Helper function to get the grouping key (for charts)
function getGroupingKey(dateString, period) {
    // Add 'T00:00:00' to ensure Date object is created at midnight UTC to prevent timezone issues
    const date = new Date(dateString + 'T00:00:00'); 
    if (isNaN(date)) return dateString; 

    switch (period) {
        case 'year':
            return date.getFullYear().toString();
        case 'month':
            // YYYY-MM format
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        case 'week':
            // Calculate week number (ISO standard approximation)
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            // set to Thursday of the current week (Thursday is always in the same week as its year)
            d.setDate(d.getDate() + 4 - (d.getDay() || 7)); 
            const yearStart = new Date(d.getFullYear(), 0, 1);
            // Calculate week number
            const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
        case 'day':
        default:
            return dateString; // YYYY-MM-DD
    }
}

function updateDisplay() {
    // 1. Get the expenses filtered by the date range
    const currentExpenses = getFilteredExpenses(); 

    const displayCurrency = document.getElementById('displayCurrency').value;
    const symbol = CURRENCY_SYMBOLS[displayCurrency];

    // 2. Convert amounts for display and charts
    const convertedExpenses = currentExpenses.map(exp => ({
        ...exp,
        // Using 'INR' as the default/fallback currency if exp.currency is missing
        convertedAmount: convertAmount(exp.amount, exp.currency || 'INR', displayCurrency),
        id: exp.id 
    }));

    // 3. Update summary stats
    const total = convertedExpenses.reduce((sum, exp) => sum + exp.convertedAmount, 0);
    document.getElementById('totalExpenses').textContent = `${symbol} ${total.toFixed(2)}`;
    // Total transactions now reflects the filtered count
    document.getElementById('totalTransactions').textContent = convertedExpenses.length; 

    // 4. Update the expense list (which includes sorting the filtered data)
    updateExpenseList(convertedExpenses, symbol);
    
    // 5. Update the charts (which use the filtered and converted data)
    updateCharts(convertedExpenses, displayCurrency);
}

function updateExpenseList(convertedExpenses, symbol) {
    const list = document.getElementById('expensesList');

    if (!convertedExpenses.length) {
        list.innerHTML = '<p class="no-data">No expenses recorded yet.</p>';
        // Check if filtered by date but no results
        if (filterDateFrom || filterDateTo) {
             list.innerHTML = `<p class="no-data">No expenses found between ${filterDateFrom || 'Start'} and ${filterDateTo || 'End'}.</p>`;
        }
        return;
    }
    
    // Core Sorting Logic 
    convertedExpenses.sort((a, b) => {
        let aVal, bVal;
        
        // Date sorting uses the actual date strings/objects
        if (sortField === 'date') {
            aVal = new Date(a.date);
            bVal = new Date(b.date);
        } else if (sortField === 'convertedAmount') {
            aVal = a.convertedAmount;
            bVal = b.convertedAmount;
        } else if (sortField === 'category') {
            aVal = a.category.toLowerCase();
            bVal = b.category.toLowerCase();
        } else {
            aVal = new Date(a.date);
            bVal = new Date(b.date);
        }
        
        let comparison = 0;
        if (aVal > bVal) {
            comparison = 1;
        } else if (aVal < bVal) {
            comparison = -1;
        }
        
        return sortDirection === 'desc' ? (comparison * -1) : comparison;
    });

    list.innerHTML = convertedExpenses.map(exp => `
        <div class="expense-item">
            <div class="expense-info">
                <div class="expense-category">${exp.category}</div>
                <div class="expense-description">${exp.description}</div>
                <div class="expense-date">${exp.date}</div>
            </div>
            <div class="expense-actions">
                <div class="expense-amount">${symbol} ${exp.convertedAmount.toFixed(2)}</div>
                <button class="delete-btn" onclick="deleteExpense(${exp.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function updateCharts(convertedExpenses, displayCurrency) {
    if (lineChartInstance) lineChartInstance.destroy();
    if (pieChartInstance) pieChartInstance.destroy();

    const lineContainer = document.getElementById('lineChartContainer');
    const pieContainer = document.getElementById('pieChartContainer');
    lineContainer.innerHTML = '<canvas id="lineChart"></canvas>';
    pieContainer.innerHTML = '<canvas id="pieChart"></canvas>';

    if (!convertedExpenses.length) {
        lineContainer.innerHTML = '<p class="no-data">No data to display in this range.</p>';
        pieContainer.innerHTML = '<p class="no-data">No data to display in this range.</p>';
        return;
    }

    const groupingPeriod = document.getElementById('groupingPeriod').value;

    // --- Line Chart Data (Grouped by time period) ---
    const dailyData = {};
    convertedExpenses.forEach(exp => {
        const key = getGroupingKey(exp.date, groupingPeriod); 
        dailyData[key] = (dailyData[key] || 0) + exp.convertedAmount;
    });

    const sortedLabels = Object.keys(dailyData).sort();
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: sortedLabels,
            datasets: [{
                label: `${groupingPeriod.charAt(0).toUpperCase() + groupingPeriod.slice(1)} Expenses (${CURRENCY_SYMBOLS[displayCurrency]})`,
                data: sortedLabels.map(d => dailyData[d]),
                borderColor: 'rgb(102, 126, 234)',
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // --- Pie Chart Data (Grouped by category) ---
    const categoryData = {};
    convertedExpenses.forEach(exp => {
        categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.convertedAmount;
    });

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    pieChartInstance = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: ['#667eea', '#764ba2', '#a36eeb', '#c7a3ff', '#3a66ff', '#ff7979']
            }]
        },
        options: { plugins: { legend: { position: 'right' } } }
    });
}

// ======================= 🚀 INIT =======================

document.addEventListener('DOMContentLoaded', () => {
    initializeListeners();
    loadExpensesFromDB(); 
});

// Expose globally
window.openConverterModal = openConverterModal;
window.openExpenseModal = openExpenseModal;
window.closeModal = closeModal;
window.convertCurrency = convertCurrency;
window.deleteExpense = deleteExpense;
window.toggleSortDirection = toggleSortDirection;
window.applyDateFilter = applyDateFilter;
window.resetDateFilter = resetDateFilter;
// NEW Functions exposed globally
window.openDownloadModal = openDownloadModal;
window.downloadExpensesAsPdf = downloadExpensesAsPdf;



//  database//


