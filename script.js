let entries = JSON.parse(localStorage.getItem("entries")) || [];

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const entryList = document.getElementById("entryList");
const totalIncomeInput = document.getElementById("totalIncome");
const totalExpensesInput = document.getElementById("totalExpenses");
const netBalanceInput = document.getElementById("netBalance");

function addEntry() {
  const description = descriptionInput.value;
  let amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (validateEntry(description, amount)) {
    amount = amount.toFixed(2);
    const newEntry = { id: Date.now(), description, amount, type };
    entries.push(newEntry);
    localStorage.setItem("entries", JSON.stringify(entries));
    resetFields();
    displayEntries();
  } else {
    alert("A valid description and a positive amount are required...⬇️");
  }
}

function validateEntry(description, amount) {
  return description && !isNaN(amount) && amount > 0;
}

function displayEntries(filter = "all") {
  entryList.innerHTML = "";

  const filteredEntries =
    filter === "all"
      ? entries
      : entries.filter((entry) => entry.type === filter);

  if (filteredEntries.length === 0) {
    entryList.innerHTML = `<p class="text-center text-gray-500">No info found. Make your first entry today!</p>`;
    return;
  }

  filteredEntries.forEach((entry) => {
    const li = document.createElement("li");
    li.className =
      "entry-item flex justify-between bg-white p-3 rounded-lg shadow-md mb-3 transform transition-all hover:scale-105";

    const contentDiv = document.createElement("div");
    contentDiv.className = "entry-content flex-1";
    contentDiv.innerHTML = `
      <span class="font-semibold">${entry.description}</span> -
      <span class="text-yellow-800"> ₹ ${entry.amount}</span>
    `;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "entry-actions flex space-x-2";

    const editButton = document.createElement("button");
    editButton.className =
      "edit-btn bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editEntry(entry.id));

    const deleteButton = document.createElement("button");
    deleteButton.className =
      "delete-btn bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteEntry(entry.id));

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);
    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);
    entryList.appendChild(li);
  });

  updateSummary();
}

function filterEntries() {
  const filterValue = document.querySelector(
    'input[name="filter"]:checked'
  )?.value;
  displayEntries(filterValue); // filter based entries
}

function deleteEntry(id) {
  entries = entries.filter((entry) => entry.id !== id);
  localStorage.setItem("entries", JSON.stringify(entries));
  displayEntries();
}

function editEntry(id) {
  const entry = entries.find((entry) => entry.id === id);
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;
}

function updateSummary() {
  const totalIncome = calculateTotal("income");
  const totalExpenses = calculateTotal("expense");
  const netBalance = totalIncome - totalExpenses;

  totalIncomeInput.innerText = totalIncome.toFixed(2);
  totalExpensesInput.innerText = totalExpenses.toFixed(2);
  netBalanceInput.innerText = netBalance.toFixed(2);
}

function calculateTotal(type) {
  return entries
    .filter((entry) => entry.type === type)
    .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
}

function resetFields() {
  descriptionInput.value = "";
  amountInput.value = "";
  typeInput.value = "income";
}

document.addEventListener("DOMContentLoaded", () => {
  displayEntries(); // event listener to radio buttons - filter & initialize

  document.querySelectorAll('input[name="filter"]').forEach((filter) => {
    filter.addEventListener("change", filterEntries);
  }); //event listener - filter radio button
});
