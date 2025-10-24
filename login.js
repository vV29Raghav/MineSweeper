const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const message = document.getElementById("message");

function getUsers() { return JSON.parse(localStorage.getItem("users")) || []; }
function saveUsers(users) { localStorage.setItem("users", JSON.stringify(users)); }

// Signup
signupBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if(!username || !password) return message.textContent = "Fill all fields";

  const users = getUsers();
  if(users.find(u => u.username === username)) return message.textContent = "Username exists!";

  users.push({ username, password, levelsCompleted: [], scores: [] });
  saveUsers(users);
  message.style.color = "#34d399";
  message.textContent = "Signup successful! You can login now.";
});

// Login
loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if(!username || !password) return message.textContent = "Fill all fields";

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if(!user) { message.style.color = "#ef4444"; return message.textContent = "Invalid credentials!"; }

  localStorage.setItem("currentUser", JSON.stringify(user));
  message.style.color = "#34d399";
  message.textContent = "Login successful! Redirecting...";
  setTimeout(()=>{ window.location.href = "main.html"; }, 1000);
});