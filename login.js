const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const message = document.getElementById("message");

function getUsers() { 
    return JSON.parse(localStorage.getItem("users")) || []; 
}

function saveUsers(users) { 
    localStorage.setItem("users", JSON.stringify(users)); 
}

// Regex patterns
const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/; // letters, numbers, underscore, 4-20 chars
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/; 
// Min 6-20 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char

// Signup
signupBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if(!username || !password) {
        message.style.color = "#ef4444";
        return message.textContent = "Fill all fields";
    }

    if(!usernameRegex.test(username)) {
        message.style.color = "#ef4444";
        return message.textContent = "Username must be 4-20 chars (letters, numbers, underscore)";
    }

    if(!passwordRegex.test(password)) {
        message.style.color = "#ef4444";
        return message.textContent = "Password must be 6-20 chars, include uppercase, lowercase, digit & special char";
    }

    const users = getUsers();
    if(users.find(u => u.username === username)) {
        message.style.color = "#ef4444";
        return message.textContent = "Username exists!";
    }

    users.push({ username, password, levelsCompleted: [], scores: [] });
    saveUsers(users);
    message.style.color = "#34d399";
    message.textContent = "Signup successful! You can login now.";
});

// Login
loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if(!username || !password) {
        message.style.color = "#ef4444";
        return message.textContent = "Fill all fields";
    }

    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if(!user) {
        message.style.color = "#ef4444";
        return message.textContent = "Invalid credentials!";
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    message.style.color = "#34d399";
    message.textContent = "Login successful! Redirecting...";
    setTimeout(() => {
        window.location.href = "main.html";
    }, 1000);
});
