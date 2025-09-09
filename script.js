const rows = 9;
const cols = 9;
let mineCount = 10;
let firstClick = true;
let flaggedCount = 0;
let timer = 0;
let timerInterval;

const board = document.getElementById('board');
const resetBtn = document.getElementById("resetBtn");

let grids = [];

function initGrid() {
  grids = [];
  for (let r = 0; r < rows; r++) {
    grids[r] = [];
    for (let c = 0; c < cols; c++) {
      grids[r][c] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0
      };
    }
  }
}

function renderBoard() {
  board.innerHTML = '';
  board.style.gridTemplateRows = `repeat(${rows}, 30px)`;
  board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      board.appendChild(cell);
    }
  }
}

function placeMines(firstRow, firstCol) {
  let placed = 0;
  while (placed < mineCount) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    if ((r === firstRow && c === firstCol) || grids[r][c].isMine) continue;
    grids[r][c].isMine = true;
    placed++;
  }
}

function calculateAdjacentMines(r, c) {
  let count = 0;
  let dirs = [-1, 0, 1];
  for (let dr of dirs) {
    for (let dc of dirs) {
      if (dr === 0 && dc === 0) continue;
      let nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grids[nr][nc].isMine) count++;
    }
  }
  return count;
}

function calculateNumbers() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grids[r][c].isMine) grids[r][c].adjacentMines = calculateAdjacentMines(r, c);
    }
  }
}

function startTimer() {
  if(!firstClick) return;
  firstClick = false;
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById('timer').innerText = `⏰ ${timer}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function revealCell(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;

  const cellData = grids[r][c];
  let cellDiv = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);

  if (cellData.isRevealed || cellData.isFlagged) return;

  if (firstClick) {
    placeMines(r, c);
    calculateNumbers();
    startTimer();
  }

  cellData.isRevealed = true;
  cellDiv.classList.add('revealed');

  if (cellData.isMine) {
    cellDiv.innerText = '💣';
    gameOver(false);
    return;
  }

  if (cellData.adjacentMines > 0) {
    cellDiv.textContent = cellData.adjacentMines;
    cellDiv.dataset.number = cellData.adjacentMines; // 🔹 Moved here for styling
    checkWin();
    return;
  }

  floodFill(r, c);
  checkWin();
}


function floodFill(r, c) {
  let dirs = [-1, 0, 1];
  for (let dr of dirs) {
    for (let dc of dirs) {
      if (dr === 0 && dc === 0) continue;
      let nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        let neighbor = grids[nr][nc];
        if(!neighbor.isRevealed && !neighbor.isMine) revealCell(nr, nc);
      }
    }
  }
}

function toggleFlag(e, r, c) {
  e.preventDefault();
  const cellData = grids[r][c];
  if(cellData.isRevealed) return;
  let cellDiv = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
  if (cellData.isFlagged) {
    cellData.isFlagged = false;
    cellDiv.textContent = '';
    flaggedCount--;
  } else {
    if (flaggedCount < mineCount) {
      cellData.isFlagged = true;
      cellDiv.textContent = '🚩';
      flaggedCount++;
    }
  }
  document.getElementById("flagCount").innerText = `🚩 ${mineCount - flaggedCount}`;
}

function checkWin() {
  let revealedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grids[r][c].isRevealed) revealedCount++;
    }
  }
  if (revealedCount === rows * cols - mineCount) gameOver(true);
}

function gameOver(won) {
  stopTimer();
  setSmiley(won ? "win" : "lose");
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let cellData = grids[r][c];
      let cellDiv = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
      if (cellData.isMine) {
        cellDiv.innerText = '💣';
        cellDiv.classList.add('mine');
      }
    }
  }
  board.replaceWith(board.cloneNode(true));
}

function setSmiley(state) {
  if (state === "normal") resetBtn.innerText = "🙂";
  else if (state === "win") resetBtn.innerText = "😎";
  else if (state === "lose") resetBtn.innerText = "😵";
}

board.addEventListener('click', (e) => {
  if (!e.target.classList.contains('cell')) return;
  const r = parseInt(e.target.dataset.row);
  const c = parseInt(e.target.dataset.col);
  revealCell(r, c);
});

board.addEventListener('contextmenu', (e) => {
  if (!e.target.classList.contains('cell')) return;
  const r = parseInt(e.target.dataset.row);
  const c = parseInt(e.target.dataset.col);
  toggleFlag(e, r, c);
});

resetBtn.addEventListener("click", () => {
  firstClick = true;
  flaggedCount = 0;
  timer = 0;
  setSmiley("normal");
  initGrid();
  renderBoard();
  document.getElementById('timer').innerText = `⏰ 0`;
  document.getElementById("flagCount").innerText = `🚩 ${mineCount}`;
});

initGrid();
renderBoard();
document.getElementById("flagCount").innerText = `🚩 ${mineCount}`;
document.getElementById('timer').innerText = `⏰ 0`;
setSmiley("normal");

cellDiv.dataset.number = cellData.adjacentMines;
if (cellData.adjacentMines > 0) {
  cellDiv.textContent = cellData.adjacentMines;
  cellDiv.dataset.number = cellData.adjacentMines; // <- for CSS colors
}
