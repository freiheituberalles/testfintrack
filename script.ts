// Define a class to hold the transaction details
class Transaction {
    constructor(public type: string, public date: string, public item: string, public amount: number) {}
  }
  
  // Function to save transactions in local storage
  function saveTransactionsToLocalStorage(transactions: Transaction[]) {
    console.log("Saving transactions to local storage:", transactions);
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
  
  // Function to load transactions from local storage
  function loadTransactionsFromLocalStorage(): Transaction[] {
    const storedTransactions = localStorage.getItem("transactions");
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  }
  
  // Keep track of all transactions in an array
  let transactions: Transaction[] = loadTransactionsFromLocalStorage();
  
  // Function to display the transaction in a card
  function addTransactionToDOM(transaction: Transaction) {
    const transactionsList = document.getElementById("transactionsList") as HTMLDivElement;
    const card = document.createElement("div");
    card.classList.add("card");
  
    // Apply color based on the type of transaction
    if (transaction.type === "cashIn") {
      card.style.backgroundColor = "#cceeff"; // Blue for Cash In
    } else {
      card.style.backgroundColor = "#ffcaca"; // Red for Cash Out
    }
  
    card.innerHTML = `
      <strong>Date:</strong> ${transaction.date}<br>
      <strong>Type:</strong> ${transaction.type === "cashIn" ? "Cash In" : "Cash Out"}<br>
      <strong>Item:</strong> ${transaction.item}<br>
      <strong>Amount:</strong> $${transaction.amount.toFixed(2)}
      <button class="deleteBtn">Delete</button>
    `;
    transactionsList.prepend(card);
  
    // Adding the "show" class after a short delay to trigger the animation
    setTimeout(() => {
      card.classList.add("show");
    }, 10);
  
    // Add event listener for the delete button
    card.querySelector(".deleteBtn")?.addEventListener("click", () => {
      transactionsList.removeChild(card);
      const index = transactions.indexOf(transaction);
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
  document.getElementById("transactionForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const dateInput = document.getElementById("date") as HTMLInputElement;
    const typeInput = document.getElementById("type") as HTMLSelectElement;
    const itemInput = document.getElementById("item") as HTMLInputElement;
    const amountInput = document.getElementById("amount") as HTMLInputElement;
  
    const date = dateInput.value;
    const type = typeInput.value;
    const item = itemInput.value;
    const amount = parseFloat(amountInput.value);
  
    if (!date || !type || !item || isNaN(amount)) {
      alert("Please fill all fields with valid data.");
      return;
    }
  
    const transaction = new Transaction(type, date, item, amount);
    addTransactionToDOM(transaction);
  
    // Clear the form fields
    dateInput.value = "";
    typeInput.value = "cashIn"; // Set the default value to "Cash In"
    itemInput.value = "";
    amountInput.value = "";
  });
  
  // Function to update the total balance
  function updateTotalBalance() {
    const totalBalanceElem = document.getElementById("totalBalance") as HTMLDivElement;
    const totalBalance = transactions.reduce((total, transaction) => {
      return transaction.type === "cashIn" ? total + transaction.amount : total - transaction.amount;
    }, 0);
    totalBalanceElem.textContent = `Total Balance: $${totalBalance.toFixed(2)}`;
  }
  