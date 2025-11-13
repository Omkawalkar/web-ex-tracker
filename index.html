<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Tracker</title>
    <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.20/jspdf.plugin.autotable.min.js"></script>
    
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="hero-section">
        <div class="hero-content">
            <h1 class="main-title">📈 Expense Tracker</h1>
            <p class="subtitle">Track your spending, visualize your habits, manage your money</p>
        </div>
    </div>

    <div class="content-wrapper">
        <div class="controls-bar">
            <div class="currency-selector">
                <label for="displayCurrency">Display Currency</label>
                <select id="displayCurrency">
                    <option value="USD">$ USD - US Dollar</option>
                    <option value="EUR">€ EUR - Euro</option>
                    <option value="GBP">£ GBP - British Pound</option>
                    <option value="JPY">¥ JPY - Japanese Yen</option>
                    <option value="INR" selected>₹ INR - Indian Rupee</option>
                    <option value="CNY">¥ CNY - Chinese Yuan</option>
                    <option value="AUD">A$ AUD - Australian Dollar</option>
                    <option value="CAD">C$ CAD - Canadian Dollar</option>
                </select>
            </div>
            <div class="currency-selector">
                <label for="groupingPeriod">Group By Time Period</label>
                <select id="groupingPeriod">
                    <option value="day" selected>Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
            </div>
            <div class="date-filter-controls">
                <div class="form-group-inline">
                    <label for="filterDateFrom">Date From</label>
                    <input type="date" id="filterDateFrom">
                </div>
                <div class="form-group-inline">
                    <label for="filterDateTo">Date To</label>
                    <input type="date" id="filterDateTo">
                </div>
                <button class="btn btn-secondary" id="applyDateFilterBtn">📅 Apply Filter</button>
                <button class="btn btn-secondary" id="resetDateFilterBtn">✖ Reset</button>
            </div>
            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="openConverterModal()">🧮 Currency Converter</button>
                <button class="btn btn-secondary" onclick="openDownloadModal()">⬇️ Download Expenses</button>
                <button class="btn btn-primary" onclick="openExpenseModal()">➕ Add Expense</button>
            </div>
        </div>

        <div class="stats-card">
            <div class="stat-item">
                <div class="stat-icon">💵</div>
                <div>
                    <p class="stat-label">Total Expenses</p>
                    <p class="stat-value" id="totalExpenses">₹0.00</p>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">📊</div>
                <div>
                    <p class="stat-label">Total Transactions</p>
                    <p class="stat-value" id="totalTransactions">0</p>
                </div>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-card">
                <h3 class="chart-title">📈 Expense Trend</h3>
                <div class="chart-container" id="lineChartContainer">
                    <canvas id="lineChart"></canvas>
                </div>
            </div>

            <div class="chart-card">
                <h3 class="chart-title">🥧 Category Breakdown</h3>
                <div class="chart-container" id="pieChartContainer">
                    <canvas id="pieChart"></canvas>
                </div>
            </div>
        </div>

        <div class="expenses-list">
            <div class="list-controls-bar">
                <h3 class="list-title">Recent Expenses</h3>
                <div class="sort-controls">
                    <div class="form-group sort-select">
                        <label for="sortField">Sort By</label>
                        <select id="sortField">
                            <option value="date" selected>Date</option>
                            <option value="convertedAmount">Amount</option>
                            <option value="category">Category</option>
                        </select>
                    </div>
                    <button id="sortDirectionBtn" class="btn btn-secondary" onclick="toggleSortDirection()">🔽</button>
                </div>
            </div>
            <div class="expense-items" id="expensesList"></div>
        </div>
    </div>

    <div id="expenseModal" class="modal">
        <div class="modal-content">
            <button class="close-modal-btn" onclick="closeModal('expenseModal')">✖</button>
            <div class="modal-header">
                <h2 class="modal-title">Add New Expense</h2>
                <p class="modal-description">Record your expense with details</p>
            </div>
            <form id="expenseForm">
                <div class="form-group">
                    <label for="amount">Amount</label>
                    <input type="number" id="amount" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" required>
                        <option value="">Select category</option>
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Bills & Utilities">Bills & Utilities</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Travel">Travel</option>
                        <option value="Education">Education</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <input type="text" id="description" required>
                </div>
                <div class="form-group">
                    <label for="date">Date</label>
                    <input type="date" id="date" required>
                </div>
                <div class="form-group">
                    <label for="expenseCurrency">Currency</label>
                    <select id="expenseCurrency">
                        <option value="USD">$ USD</option>
                        <option value="EUR">€ EUR</option>
                        <option value="GBP">£ GBP</option>
                        <option value="JPY">¥ JPY</option>
                        <option value="INR" selected>₹ INR</option>
                        <option value="CNY">¥ CNY</option>
                        <option value="AUD">A$ AUD</option>
                        <option value="CAD">C$ CAD</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Add Expense</button>
            </form>
        </div>
    </div>

    <div id="converterModal" class="modal">
        <div class="modal-content">
            <button class="close-modal-btn" onclick="closeModal('converterModal')">✖</button>
            <div class="modal-header">
                <h2 class="modal-title">Currency Converter</h2>
                <p class="modal-description">Convert between different currencies</p>
            </div>
            <div class="form-group">
                <label for="converterAmount">Amount</label>
                <input type="number" id="converterAmount" step="0.01">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="fromCurrency">From</label>
                    <select id="fromCurrency">
                        <option value="USD">$ USD</option>
                        <option value="EUR">€ EUR</option>
                        <option value="GBP">£ GBP</option>
                        <option value="JPY">¥ JPY</option>
                        <option value="INR">₹ INR</option>
                        <option value="CNY">¥ CNY</option>
                        <option value="AUD">A$ AUD</option>
                        <option value="CAD">C$ CAD</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="toCurrency">To</label>
                    <select id="toCurrency">
                        <option value="EUR">€ EUR</option>
                        <option value="USD">$ USD</option>
                        <option value="GBP">£ GBP</option>
                        <option value="JPY">¥ JPY</option>
                        <option value="INR">₹ INR</option>
                        <option value="CNY">¥ CNY</option>
                        <option value="AUD">A$ AUD</option>
                        <option value="CAD">C$ CAD</option>
                    </select>
                </div>
            </div>
            <button onclick="convertCurrency()" class="btn btn-primary" style="width: 100%;">Convert</button>
            <div id="conversionResult"></div>
        </div>
    </div>

    <div id="downloadModal" class="modal">
        <div class="modal-content">
            <button class="close-modal-btn" onclick="closeModal('downloadModal')">✖</button>
            <div class="modal-header">
                <h2 class="modal-title">Download Expenses Report</h2>
                <p class="modal-description">Select a date range to generate a PDF report.</p>
            </div>
            <div class="form-group">
                <label for="downloadDateFrom">Date From</label>
                <input type="date" id="downloadDateFrom">
            </div>
            <div class="form-group">
                <label for="downloadDateTo">Date To</label>
                <input type="date" id="downloadDateTo">
            </div>
            <button onclick="downloadExpensesAsPdf()" class="btn btn-primary" style="width: 100%;">
                ⬇️ Download PDF
            </button>
            <div id="downloadMessage" style="margin-top: 1rem; text-align: center; color: #667eea; font-weight: 500;"></div>
        </div>
    </div>
    <script src="script.js"></script>
</body>

</html>
