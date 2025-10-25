
// ---------- Dynamic Level Setup ----------
const urlParams = new URLSearchParams(window.location.search);
const rows = parseInt(urlParams.get('rows')) || 9;
const cols = parseInt(urlParams.get('cols')) || 9;
const mineCount = parseInt(urlParams.get('mines')) || 10;
const levelName = urlParams.get('level') || 'custom';

// ---------- Player Name ----------
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
document.getElementById("playerName").textContent = `Player: ${currentUser ? currentUser.username : "Guest"}`;

// ---------- Game Variables ----------
let firstClick = true;
let flaggedCount = 0;
let timer = 0;
let timerInterval;
const board = document.getElementById('board');
const resetBtn = document.getElementById("resetBtn");
let grids = [];

// ---------- Initialize Grid ----------
function initGrid() {
  grids = [];
  for(let r=0;r<rows;r++){
    grids[r] = [];
    for(let c=0;c<cols;c++){
      grids[r][c] = { isMine:false, isRevealed:false, isFlagged:false, adjacentMines:0 };
    }
  }
}

// ---------- Render Board ----------
function renderBoard(){
  board.innerHTML='';

  // Get max available width and height for the board
  const maxBoardWidth = board.parentElement.clientWidth - 220; // 220px reserved for sidebar
  const maxBoardHeight = window.innerHeight * 0.7; // 70% of viewport height

  // Calculate cell size
  const cellSize = Math.min(
    Math.floor(maxBoardWidth / cols),
    Math.floor(maxBoardHeight / rows),
    50 // max cell size to avoid huge cells in tiny grids
  );

  board.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  board.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;

  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row=r;
      cell.dataset.col=c;
      board.appendChild(cell);
    }
  }

  document.getElementById("flagCount").innerText = `🚩 ${mineCount}`;
  document.getElementById('timer').innerText = `⏰ 0`;
}



// ---------- Place Mines ----------
function placeMines(firstRow, firstCol){
  let placed=0;
  while(placed < mineCount){
    let r=Math.floor(Math.random()*rows);
    let c=Math.floor(Math.random()*cols);
    if((r===firstRow && c===firstCol)||grids[r][c].isMine) continue;
    grids[r][c].isMine=true;
    placed++;
  }
}

// ---------- Calculate Numbers ----------
function calculateAdjacentMines(r,c){
  let count=0;
  for(let dr=-1; dr<=1; dr++){
    for(let dc=-1; dc<=1; dc++){
      if(dr===0 && dc===0) continue;
      let nr=r+dr, nc=c+dc;
      if(nr>=0 && nr<rows && nc>=0 && nc<cols && grids[nr][nc].isMine) count++;
    }
  }
  return count;
}

function calculateNumbers(){
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      if(!grids[r][c].isMine) grids[r][c].adjacentMines=calculateAdjacentMines(r,c);
    }
  }
}

// ---------- Timer ----------
function startTimer(){
  if(!firstClick) return;
  firstClick=false;
  timerInterval=setInterval(()=>{
    timer++;
    document.getElementById('timer').innerText=`⏰ ${timer}`;
  },1000);
}
function stopTimer(){ clearInterval(timerInterval); }

// ---------- Reveal Cells ----------
function revealCell(r, c, isPlayerClick = true){
  if(r<0||r>=rows||c<0||c>=cols) return;
  const cellData = grids[r][c];
  const cellDiv = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
  if(cellData.isRevealed || cellData.isFlagged) return;

  if(isPlayerClick && firstClick){
    placeMines(r,c);
    calculateNumbers();
    startTimer();
  }

  cellData.isRevealed = true;
  cellDiv.classList.add('revealed');

  if(cellData.isMine){
    if(isPlayerClick) gameOver(false);
    cellDiv.innerText='💣';
    return;
  }

  if(cellData.adjacentMines>0){
    cellDiv.textContent=cellData.adjacentMines;
    if(isPlayerClick) checkWin();
    return;
  }

  floodFill(r, c, isPlayerClick);
  if(isPlayerClick) checkWin();
}

function floodFill(r, c, isPlayerClick){
  for(let dr=-1; dr<=1; dr++){
    for(let dc=-1; dc<=1; dc++){
      if(dr===0 && dc===0) continue;
      let nr=r+dr, nc=c+dc;
      if(nr>=0 && nr<rows && nc>=0 && nc<cols){
        let neighbor=grids[nr][nc];
        if(!neighbor.isRevealed && !neighbor.isMine) revealCell(nr, nc, false);
      }
    }
  }
}


// ---------- Flags ----------
function toggleFlag(e,r,c){
  e.preventDefault();
  const cellData=grids[r][c];
  if(cellData.isRevealed) return;
  const cellDiv=document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
  if(cellData.isFlagged){
    cellData.isFlagged=false;
    cellDiv.textContent='';
    flaggedCount--;
  } else if(flaggedCount<mineCount){
    cellData.isFlagged=true;
    cellDiv.textContent='🚩';
    flaggedCount++;
  }
  document.getElementById("flagCount").innerText=`🚩 ${mineCount-flaggedCount}`;
}

// ---------- Win / Game Over ----------
function checkWin(){
  let revealed=0;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      if(grids[r][c].isRevealed) revealed++;
    }
  }
  if(revealed===rows*cols-mineCount) gameOver(true);
}

function gameOver(won){
  stopTimer();
  setSmiley(won?"win":"lose");
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      let cellData=grids[r][c];
      let cellDiv=document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
      if(cellData.isMine) cellDiv.innerText='💣';
      if(cellData.isMine) cellDiv.classList.add('mine');
    }
  }
  board.replaceWith(board.cloneNode(true));
  document.getElementById("message").textContent = won ? `🎉 You won in ${timer} seconds!` : "💥 You hit a mine!";
  if(won) saveScore(timer);
}

// ---------- Smiley ----------
function setSmiley(state){
  if(state==="normal") resetBtn.innerText="🙂";
  else if(state==="win") resetBtn.innerText="😎";
  else if(state==="lose") resetBtn.innerText="😵";
}

// ---------- Score Saving ----------
function saveScore(time){
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push({ name: currentUser ? currentUser.username : 'Guest', level: levelName, time: time });
  localStorage.setItem("scores", JSON.stringify(scores));
}

// ---------- Leaderboard ----------
function goToLeaderboard(){ window.location.href="leaderboard.html"; }

// ---------- Event Listeners ----------
board.addEventListener('click',(e)=>{
  if(!e.target.classList.contains('cell')) return;
  const r=parseInt(e.target.dataset.row);
  const c=parseInt(e.target.dataset.col);
  revealCell(r,c);
});

board.addEventListener('contextmenu',(e)=>{
  if(!e.target.classList.contains('cell')) return;
  const r=parseInt(e.target.dataset.row);
  const c=parseInt(e.target.dataset.col);
  toggleFlag(e,r,c);
});

resetBtn.addEventListener("click",()=>{
  firstClick=true;
  flaggedCount=0;
  timer=0;
  clearInterval(timerInterval);
  setSmiley("normal");
  initGrid();
  renderBoard();
  document.getElementById("message").textContent = "";
});

// ---------- Initialize ----------
initGrid();
renderBoard();
setSmiley("normal");
