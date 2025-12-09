document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addBtn");
    if (addBtn) addBtn.addEventListener("click", addCustomer);

    const searchBtn = document.getElementById("searchBtn");
    const resetBtn = document.getElementById("resetBtn");

    if (searchBtn) searchBtn.addEventListener("click", searchCustomer);
    if (resetBtn) resetBtn.addEventListener("click", resetSearch);

    displayCustomers();
    displayHistory();
});

let customers = JSON.parse(localStorage.getItem("customers")) || [];
let historyLogs = JSON.parse(localStorage.getItem("history")) || [];

function saveData() {
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("history", JSON.stringify(historyLogs));
}

function addCustomer() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const age = document.getElementById("age").value.trim();
    const address = document.getElementById("address").value.trim();
    const notes = document.getElementById("notes").value.trim();

    if (!name || !email || !phone || !age || !address) {
        alert("Please fill all required fields!");
        return;
    }

    const newCustomer = { name, email, phone, age, address, notes };
    customers.push(newCustomer);

    historyLogs.push({
        action: "Added",
        customer: newCustomer,
        date: new Date().toLocaleString()
    });

    saveData();
    displayCustomers();
    displayHistory();
    clearInputs();
}

function clearInputs() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("age").value = "";
    document.getElementById("address").value = "";
    document.getElementById("notes").value = "";

    const addBtn = document.getElementById("addBtn");
    addBtn.textContent = "Add";
    addBtn.onclick = addCustomer;
}

function displayCustomers(list = customers) {
    const table = document.getElementById("customerTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Address</th>
            <th>Notes</th>
            <th>Actions</th>
        </tr>
    `;

    list.forEach((c, i) => {
        table.innerHTML += `
        <tr>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
            <td>${c.age}</td>
            <td>${c.address}</td>
            <td>${c.notes}</td>
            <td>
                <button onclick="editCustomer(${i})">Edit</button>
                <button onclick="deleteCustomer(${i})">Delete</button>
            </td>
        </tr>`;
    });
}

function editCustomer(index) {
    const c = customers[index];

    document.getElementById("name").value = c.name;
    document.getElementById("email").value = c.email;
    document.getElementById("phone").value = c.phone;
    document.getElementById("age").value = c.age;
    document.getElementById("address").value = c.address;
    document.getElementById("notes").value = c.notes;

    const addBtn = document.getElementById("addBtn");
    addBtn.textContent = "Update";

    addBtn.onclick = function () {
        const updatedCustomer = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            age: document.getElementById("age").value,
            address: document.getElementById("address").value,
            notes: document.getElementById("notes").value
        };

        customers[index] = updatedCustomer;

        historyLogs.push({
            action: "Updated",
            customer: updatedCustomer,
            date: new Date().toLocaleString()
        });

        saveData();
        displayCustomers();
        displayHistory();
        clearInputs();
    };
}

function deleteCustomer(index) {
    const removed = customers[index];

    historyLogs.push({
        action: "Deleted",
        customer: removed,
        date: new Date().toLocaleString()
    });

    customers.splice(index, 1);
    saveData();
    displayCustomers();
    displayHistory();
}

function displayHistory() {
    const historyDiv = document.getElementById("historyLogs");
    if (!historyDiv) return;

    if (historyLogs.length === 0) {
        historyDiv.innerHTML = "<p>No history yet.</p>";
        return;
    }

    historyDiv.innerHTML = "";

    historyLogs.forEach(log => {
        const logEntry = document.createElement("div");
        logEntry.classList.add("log-entry");
        logEntry.innerHTML = `
            <strong>${log.action}</strong> - ${log.date}<br>
            Name: ${log.customer.name}<br>
            Email: ${log.customer.email}<br>
            Phone: ${log.customer.phone}<br>
            Age: ${log.customer.age}<br>
            Address: ${log.customer.address}<br>
            Notes: ${log.customer.notes}
            <hr>
        `;
        historyDiv.appendChild(logEntry);
    });
}

/* -------------------------------------------
   SEARCH FUNCTION
--------------------------------------------*/

function searchCustomer() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(keyword) ||
        c.email.toLowerCase().includes(keyword) ||
        c.phone.toLowerCase().includes(keyword) ||
        c.address.toLowerCase().includes(keyword) ||
        c.age.toLowerCase().includes(keyword) ||
        (c.notes && c.notes.toLowerCase().includes(keyword))
    );

    displayCustomers(filtered);
}

function resetSearch() {
    document.getElementById("searchInput").value = "";
    displayCustomers(customers);
}
