interface Transaction {
  date: string;
  item: string;
  amount: number;
  type: "cash-in" | "cash-out";
}

function getTransactionsFromStorage(): Transaction[] {
  const transactionsJSON = localStorage.getItem("transactions");
  return transactionsJSON ? JSON.parse(transactionsJSON) : [];
}

function addTransactionCard(transaction: Transaction) {
  // Function implementation remains the same
}

document.addEventListener("DOMContentLoaded", () => {
  const transactionForm = document.getElementById("transactionForm") as HTMLFormElement;
  let transactionCards = document.getElementById("transactionCards");
  const totalBalanceElement = document.getElementById("totalBalance");

  if (!transactionCards || !totalBalanceElement) {
    console.error("transactionCards or totalBalance element not found!");
    return;
  }

  function displayTotalBalance(transactions: Transaction[]) {
    const totalBalance = calculateTotalBalance(transactions);
    const totalBalanceElement = document.getElementById("totalBalance");
  
    if (totalBalanceElement) {
      totalBalanceElement.innerText = `Saldo: Rp${totalBalance.toFixed(2)}`;
  
      if (totalBalance < 0) {
        totalBalanceElement.style.color = "#cf0000";
      } else if (totalBalance > 0.1) {
        totalBalanceElement.style.color = "#0016c2";
      } else {
        totalBalanceElement.style.color = "initial"; // Reset to default color
      }

      // Add dynamic text based on the total balance
      const dynamicTextElement = document.getElementById("dynamicText");
      if (dynamicTextElement) {
        if (totalBalance == 0){
          dynamicTextElement.innerHTML = "<b>Status Keuangan Anda: Belum Ada Data</b>"
        } else if (totalBalance > 10000000000) {
          dynamicTextElement.innerHTML = "<b>Status Keuangan Anda:</b> <b class = 'positiveValue';>Sultan</b>";
        } else if (totalBalance > 1000000000) {
          dynamicTextElement.innerHTML = "<b>Status Keuangan Anda:</b> <b class = 'positiveValue';>Ampun Gan</b>";
        } else if (totalBalance > 100000000) {
          dynamicTextElement.innerHTML = "<b>Status Keuangan Anda:</b> <b class = 'positiveValue';>Gelo</b>";
        } else if (totalBalance > 10000000) {
          dynamicTextElement.innerHTML = "<b>Status Keuangan Anda:</b> <b class = 'positiveValue';>Tjakep</b>";
        } else if (totalBalance > 1000000) {
          dynamicTextElement.innerHTML = "<b>Status Keuangan Anda:</b> <b class = 'positiveValue';>Gud</b>"; // Display if total balance is greater than -10000
        } else if (totalBalance > 0.000001) {
          dynamicTextElement.innerHTML = "<b>Status Keuangan Anda:</b> <b class = 'positiveValue';>Oke kok</b>"; // Display if total balance is greater than -10000
        } else if (totalBalance < -100000000) {
          dynamicTextElement.innerHTML = "<b>Status Keuangan Anda:</b> <b class = 'negativeValue';>KACAU BANGET BOSS</b>"; // Display if total balance is greater than -10000
        } else if (totalBalance < -10000000) {
          dynamicTextElement.innerHTML = "<b class = 'negativeValue';> <b class = 'negativeValue';>GWS DAH</b>"; // Display if total balance is greater than -1000
        } else if (totalBalance < -1000000) {
          dynamicTextElement.innerHTML = "<b class = 'negativeValue';>Status Keuangan Anda:</b> <b class = 'negativeValue';>WADUCH </b>"; // Display if total balance is greater than -500
        } else if (totalBalance < -100000) {
          dynamicTextElement.innerHTML = "<b class = 'negativeValue';>Status Keuangan Anda:</b> <b class = 'negativeValue';>Bahaya bro</b>";
        } else if (totalBalance < -0.000000001) {
          dynamicTextElement.innerHTML = "<b class = 'negativeValue';>Status Keuangan Anda:</b> <b class = 'negativeValue';>Coba deh Berhemat</b>"; // Display if total balance is greater than -100
        } else {
          dynamicTextElement.innerHTML = "<b>Status Keuangan Anda:</b>"; // Clear the dynamic text if total balance is positive or above -100
        }
      }
    }
  }

  function calculateTotalBalance(transactions: Transaction[]): number {
    return transactions.reduce((total, transaction) => {
      return transaction.type === "cash-in" ? total + transaction.amount : total - transaction.amount;
    }, 0);
  }

  transactionForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const dateInput = document.getElementById("date") as HTMLInputElement;
    const itemInput = document.getElementById("item") as HTMLInputElement;
    const amountInput = document.getElementById("amount") as HTMLInputElement;
    const typeInput = document.getElementById("type") as HTMLSelectElement; // Get the type input

    const date = dateInput.value;
    const item = itemInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value as "cash-in" | "cash-out"; // Ensure the type value is one of the specified options

    if (!date || !item || isNaN(amount)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    // Create a new transaction
    const transaction: Transaction = { date, item, amount, type };
    addTransactionCard(transaction);

    dateInput.value = "";
    itemInput.value = "";
    amountInput.value = "";
    typeInput.value ="";

    // Save the transaction to LocalStorage
    saveTransaction(transaction);

    // Update total balance after adding the new transaction
    const savedTransactions = getTransactionsFromStorage();
    displayTotalBalance(savedTransactions);
  });

  function addTransactionCard(transaction: Transaction) {
    const card = document.createElement("div");
    card.classList.add("transaction-card");
  
    // Set the card color based on the transaction type
    if (transaction.type === "cash-out") {
      card.style.borderColor = "#f0d0d0"; // Red background for cash-out
      card.style.backgroundColor = "#fafafa";
      card.style.color = "#cf0000"; // Red text for cash-out
    } else {
      card.style.borderColor = "#abd5ff";
      card.style.backgroundColor = "#fafafa"; // Blue background for cash-in
      card.style.color = "#0016c2"; // Green text for cash-in
    }
  
    card.innerHTML = `
      <p>Tgl Transaksi: ${transaction.date}</p>
      <p>Item: ${transaction.item}</p>
      <p>Jumlah: Rp${transaction.amount}</p>
      <p>Tipe: ${transaction.type === 'cash-in' ? 'Cash In' : 'Cash Out'}</p> <!-- Display the type label -->
      <button class="delete-btn">Buang</button>
    `;
  
    const deleteBtn = card.querySelector(".delete-btn") as HTMLButtonElement;
    deleteBtn.addEventListener("click", () => {
      deleteTransaction(transaction);
  
      // Add rotation animation when deleting a transaction card
      card.style.transition = "transform 0.5s";
      card.style.transform = "rotate(360deg) scale(0)";
      card.addEventListener("transitionend", () => {
        card.remove();
      });
  
      // Update total balance after deleting the transaction
      const savedTransactions = getTransactionsFromStorage();
      displayTotalBalance(savedTransactions);
    });
  
    // Add bounce animation when adding a new transaction card
    card.style.animation = "bounce 0.5s";
    card.addEventListener("animationend", () => {
      card.style.animation = "";
    });
  
    transactionCards?.appendChild(card);
  }
  
  // Add CSS animation keyframes for the bounce effect
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    styleSheet.insertRule(`@keyframes bounce {
      0% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }`);
  }

  function saveTransaction(transaction: Transaction) {
    const existingTransactions = getTransactionsFromStorage();
    existingTransactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(existingTransactions));
  }

  function deleteTransaction(transaction: Transaction) {
    const existingTransactions = getTransactionsFromStorage();
    const updatedTransactions = existingTransactions.filter(
      (t) => !(t.date === transaction.date && t.item === transaction.item && t.amount === transaction.amount)
    );
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  }

  // Load transactions from LocalStorage and render them on page load
  const savedTransactions = getTransactionsFromStorage();
  savedTransactions.forEach(addTransactionCard);

  // Display total balance on page load
  displayTotalBalance(savedTransactions);
});

  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDarkMode);

  // Get the themeToggle button element
  const themeToggle = document.getElementById("themeToggle");

  // Check if the themeToggle button element exists
  if (themeToggle) {
    // Toggle the theme and button text when the button is clicked
    themeToggle.addEventListener("click", () => {
      const isDarkMode = document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

      // Toggle the button text based on the current theme
      if (isDarkMode) {
        themeToggle.textContent = "Aktif: Mode Fokus";
      } else {
        themeToggle.textContent = "Aktif: Mode Standar";
      }
    });
  } else {
    console.error("themeToggle element not found!");
  }

function setTheme(isDarkMode: boolean) {
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}