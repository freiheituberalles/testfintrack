var _a;
// Define a class to hold the transaction details
var Transaction = /** @class */ (function () {
    function Transaction(type, date, item, amount) {
        this.type = type;
        this.date = date;
        this.item = item;
        this.amount = amount;
    }
    return Transaction;
}());
// Function to save transactions in local storage
function saveTransactionsToLocalStorage(transactions) {
    console.log("Saving transactions to local storage:", transactions);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}
// Function to load transactions from local storage
function loadTransactionsFromLocalStorage() {
    var storedTransactions = localStorage.getItem("transactions");
    return storedTransactions ? JSON.parse(storedTransactions) : [];
}
// Keep track of all transactions in an array
var transactions = loadTransactionsFromLocalStorage();
// Function to display the transaction in a card
function addTransactionToDOM(transaction) {
    var _a;
    var transactionsList = document.getElementById("transactionsList");
    var card = document.createElement("div");
    card.classList.add("card");
    // Apply color based on the type of transaction
    if (transaction.type === "cashIn") {
        card.style.backgroundColor = "#cceeff"; // Blue for Cash In
    }
    else {
        card.style.backgroundColor = "#ffcaca"; // Red for Cash Out
    }
    card.innerHTML = "\n      <strong>Date:</strong> ".concat(transaction.date, "<br>\n      <strong>Type:</strong> ").concat(transaction.type === "cashIn" ? "Cash In" : "Cash Out", "<br>\n      <strong>Item:</strong> ").concat(transaction.item, "<br>\n      <strong>Amount:</strong> $").concat(transaction.amount.toFixed(2), "\n      <button class=\"deleteBtn\">Delete</button>\n    ");
    transactionsList.prepend(card);
    // Adding the "show" class after a short delay to trigger the animation
    setTimeout(function () {
        card.classList.add("show");
    }, 10);
    // Add event listener for the delete button
    (_a = card.querySelector(".deleteBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        transactionsList.removeChild(card);
        var index = transactions.indexOf(transaction);
        if (index !== -1) {
            transactions.splice(index, 1);
            updateTotalBalance();
            saveTransactionsToLocalStorage(transactions); // Save transactions after deletion
        }
    });
    // Add transaction to the array
    transactions.unshift(transaction);
    updateTotalBalance();
    saveTransactionsToLocalStorage(transactions); // Save transactions after addition
}
// Handle the form submission
(_a = document.getElementById("transactionForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", function (event) {
    event.preventDefault();
    var dateInput = document.getElementById("date");
    var typeInput = document.getElementById("type");
    var itemInput = document.getElementById("item");
    var amountInput = document.getElementById("amount");
    var date = dateInput.value;
    var type = typeInput.value;
    var item = itemInput.value;
    var amount = parseFloat(amountInput.value);
    if (!date || !type || !item || isNaN(amount)) {
        alert("Please fill all fields with valid data.");
        return;
    }
    var transaction = new Transaction(type, date, item, amount);
    addTransactionToDOM(transaction);
    // Clear the form fields
    dateInput.value = "";
    typeInput.value = "cashIn"; // Set the default value to "Cash In"
    itemInput.value = "";
    amountInput.value = "";
});
// Function to update the total balance
function updateTotalBalance() {
    var totalBalanceElem = document.getElementById("totalBalance");
    var totalBalance = transactions.reduce(function (total, transaction) {
        return transaction.type === "cashIn" ? total + transaction.amount : total - transaction.amount;
    }, 0);
    totalBalanceElem.textContent = "Total Balance: $".concat(totalBalance.toFixed(2));
}
