const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const modeSelect = document.getElementById("mode");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = true;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", cellClicked));
resetBtn.addEventListener("click", resetGame);
modeSelect.addEventListener("change", resetGame);

function cellClicked() {
  const index = this.getAttribute("data-index");

  if (board[index] !== "" || !running) return;

  makeMove(index, currentPlayer);

  // Computer plays ONLY in AI mode and ONLY when O's turn
  if (running && modeSelect.value === "ai" && currentPlayer === "O") {
    setTimeout(computerMove, 400);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  checkWinner(player);
}

function computerMove() {
  let move =
    findBestMove("O") ||     // Win
    findBestMove("X") ||     // Block
    (board[4] === "" ? 4 : null) || // Center
    pickCorner() ||
    pickAny();

  makeMove(move, "O");
}

function findBestMove(player) {
  for (let [a, b, c] of winConditions) {
    let values = [board[a], board[b], board[c]];
    if (values.filter(v => v === player).length === 2 && values.includes("")) {
      return [a, b, c][values.indexOf("")];
    }
  }
  return null;
}

function pickCorner() {
  const corners = [0,2,6,8].filter(i => board[i] === "");
  return corners.length ? corners[Math.floor(Math.random() * corners.length)] : null;
}

function pickAny() {
  const empty = board.map((v,i) => v === "" ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function checkWinner(player) {
  for (let [a, b, c] of winConditions) {
    if (board[a] === player && board[b] === player && board[c] === player) {
      statusText.textContent =
        modeSelect.value === "ai" && player === "O"
          ? "Computer wins 🤖🔥"
          : `Player ${player} wins 🎉`;
      running = false;
      return;
    }
  }

  if (!board.includes("")) {
    statusText.textContent = "Draw 😐";
    running = false;
    return;
  }

  // Switch turns
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // Correct status message
  if (modeSelect.value === "ai" && currentPlayer === "O") {
    statusText.textContent = "Computer's turn 🤖";
  } else {
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  running = true;
  statusText.textContent = "Player X's turn";
  cells.forEach(cell => cell.textContent = "");
}
