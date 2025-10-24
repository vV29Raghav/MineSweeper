// ---------- Helper Functions ----------
function getScores() {
  return JSON.parse(localStorage.getItem("scores")) || [];
}

function saveScores(scores) {
  localStorage.setItem("scores", JSON.stringify(scores));
}

// ---------- Display Leaderboard ----------
function showLeaderboard() {
  const scores = getScores();
  const tbody = document.querySelector("#leaderboardTable tbody");
  tbody.innerHTML = "";

  scores.forEach((score, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td contenteditable="true" class="editable" data-index="${index}" data-field="name">${score.name}</td>
      <td>${score.level}</td>
      <td contenteditable="true" class="editable" data-index="${index}" data-field="time">${score.time}</td>
      <td>
        <button class="deleteBtn" data-index="${index}">❌ Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ---------- Update Score ----------
document.addEventListener("input", (e) => {
  if (e.target.classList.contains("editable")) {
    const index = e.target.dataset.index;
    const field = e.target.dataset.field;
    const scores = getScores();
    scores[index][field] = e.target.innerText;
    saveScores(scores);
  }
});

// ---------- Delete Single Score ----------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    const index = e.target.dataset.index;
    const scores = getScores();
    scores.splice(index, 1);
    saveScores(scores);
    showLeaderboard();
  }
});

// ---------- Clear All ----------
document.getElementById("clearBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all scores?")) {
    localStorage.removeItem("scores");
    showLeaderboard();
  }
});

// ---------- Initialize ----------
showLeaderboard();
