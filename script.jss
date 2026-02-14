// SIGNUP
function signup() {
    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    localStorage.setItem("user", JSON.stringify(user));
    alert("Signup successful!");
}

// LOGIN
function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser && savedUser.email === email && savedUser.password === password) {
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid login");
    }
}

// LOGOUT
function logout() {
    window.location.href = "index.html";
}

// ADD TRANSACTION
function addTransaction() {
    const desc = document.getElementById("desc").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!desc || !amount) {
        alert("Fill all fields");
        return;
    }

    const transaction = { desc, amount, type, category };

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    loadDashboard();
}

// LOAD DASHBOARD
function loadDashboard() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let income = 0;
    let expense = 0;

    const list = document.getElementById("transactionList");
    list.innerHTML = "";

    transactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;

        const li = document.createElement("li");
        li.textContent = `${t.desc} - ₹${t.amount} (${t.category})`;
        list.appendChild(li);
    });

    document.getElementById("income").textContent = income;
    document.getElementById("expense").textContent = expense;
    document.getElementById("balance").textContent = income - expense;

    renderChart(transactions);
}

// CHART
function renderChart(transactions) {
    const categories = {};
    
    transactions.forEach(t => {
        if (t.type === "expense") {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        }
    });

    const ctx = document.getElementById("expenseChart").getContext("2d");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories)
            }]
        }
    });
}
