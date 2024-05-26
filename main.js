const d = document,
  playerVsPlayer = d.querySelector(".game_player-vs-player"),
  playerVsMachine = d.querySelector(".game_player-vs-machine"),
  gameBoard = d.querySelector(".game_board"),
  gameMessage = d.querySelector(".game_message"),
  allGameCell = d.querySelectorAll(".game_cell"),
  puntajePartida = d.querySelector(".game_puntajePartida"),
  reiniciar = d.querySelector(".game_reiniciar"),
  reiniciarPuntajes = d.querySelector(".game_reiniciarPuntajes"),
  nombres = d.querySelector(".nombres"),
  nombresForm = d.querySelector(".nombres_form"),
  jugador1 = d.querySelector(".nombres_jugador1"),
  jugador2 = d.querySelector(".nombres_jugador2"),
  jugador = d.querySelector(".game_jugador"),
  maquina = d.querySelector(".game_maquina"),
  resetMatchBtn = d.getElementById("game_btnReiniciarPartida"),
  resetScoreboardBtn = d.getElementById("resetScoreboardBtn"),
  nextMatchBtn = d.getElementById("nextMatchBtn"),
  game_nextMatch = d.querySelector(".game_nextMatch"),
  gameMarcador1 = d.querySelector(".game_marcador1"),
  gameMarcador2 = d.querySelector(".game_marcador2"),
  gameEmpate = d.querySelector(".game_empate");

let partidasGanadasjug1 = [];
let partidasGanadasjug2 = [];
let juegosCerrados = [];
let currentGameId = 0;
let board = [];
let currentPlayer = "X";
let gameType = "";

playerVsPlayer.addEventListener("click", () => {
  if (currentGameId > 0) {
    iniciarJuego("jugador-vs-jugador");
    return;
  }

  nombres.classList.remove("hidden");
  registroNombres();
});

playerVsMachine.addEventListener("click", () => {
  iniciarJuego("jugador-vs-maquina");
});

//Registro nombres de jugadores
function registroNombres() {
  nombresForm.addEventListener("submit", (e) => {
    e.preventDefault();
    jugador.innerHTML = jugador1.value;
    maquina.innerHTML = jugador2.value;
    nombresForm.reset();
    nombres.classList.add("hidden");
    iniciarJuego("jugador-vs-jugador");
  });
}

function registrarGanador(jugador, juegoId) {
  if (jugador == "X") {
    partidasGanadasjug1.push(juegoId);
  } else {
    partidasGanadasjug2.push(juegoId);
  }
  updateScoreboard();
}

function registrarJuegoCerrado(juegoId) {
  juegosCerrados.push(juegoId);
  updateScoreboard();
}

function updateScoreboard() {
  gameMarcador1.textContent = partidasGanadasjug1.length;
  gameMarcador2.textContent = partidasGanadasjug2.length;
  gameEmpate.textContent = juegosCerrados.length;
}

function iniciarJuego(tipo) {
  gameType = tipo;
  currentPlayer = "X";
  board = Array(9).fill(null);
  currentGameId++;
  gameBoard.classList.remove("hidden");
  puntajePartida.classList.remove("hidden");
  game_nextMatch.classList.remove("hidden");
  reiniciar.classList.remove("hidden");
  reiniciarPuntajes.classList.remove("hidden");
  gameMessage.textContent = "";
  allGameCell.forEach((cell) => {
    cell.textContent = "";
    cell.addEventListener("click", handleCellClick, { once: true });
  });
}

function handleCellClick(event) {
  const index = event.target.getAttribute("data-index");
  if (board[index] === null) {
    board[index] = currentPlayer;
    event.target.innerHTML = blurOrRed(currentPlayer);
    if (checkWinner()) {
      registrarGanador(currentPlayer, currentGameId);
      gameMessage.textContent = `${changenames(currentPlayer)} ha ganado!`;
      allGameCell.forEach((cell) => {
        cell.removeEventListener("click", handleCellClick);
      });
      game_btnReiniciarPartida.disabled = true;
    } else if (board.every((cell) => cell !== null)) {
      registrarJuegoCerrado(currentGameId);
      gameMessage.textContent = "El juego ha terminado en empate.";
      game_btnReiniciarPartida.disabled = true;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (gameType === "jugador-vs-maquina" && currentPlayer === "O") {
        maquinaJuega();
      }
    }
  }
}

function maquinaJuega() {
  setTimeout(() => {
    let availableCells = board.map((cell, index) => (cell === null ? index : null)).filter((val) => val !== null);
    let move = availableCells[Math.floor(Math.random() * availableCells.length)];
    board[move] = "O";
    document.querySelector(`.game_cell[data-index='${move}']`).innerHTML = blurOrRed("O");
    if (checkWinner()) {
      registrarGanador("O");
      gameMessage.textContent = "La máquina ha ganado!";
      allGameCell.forEach((cell) => {
        cell.removeEventListener("click", handleCellClick);
      });
      game_btnReiniciarPartida.disabled = true;
    } else if (board.every((cell) => cell !== null)) {
      registrarJuegoCerrado(currentGameId);
      gameMessage.textContent = "El juego ha terminado en empate.";
    } else {
      currentPlayer = "X";
    }
  }, 600);
}

function blurOrRed(letter) {
  if (letter == "X") {
    return `<span style="color:red;"> X <span>`;
  } else {
    return `<span style="color:blue;"> O <span>`;
  }
}

// Resetea el tablero
function clearBoard() {
  board = Array(9).fill(null);
  allGameCell.forEach((cell) => {
    cell.textContent = "";
    cell.addEventListener("click", handleCellClick, { once: true });
  });
  gameMessage.textContent = "";
}

resetMatchBtn.addEventListener("click", () => {
  clearBoard();
});

// Reiniciar puntajes
resetScoreboardBtn.addEventListener("click", () => {
  currentGameId = 1;
  partidasGanadasjug1 = [];
  partidasGanadasjug2 = [];
  juegosCerrados = [];
  updateScoreboard();
  clearBoard();
  game_btnReiniciarPartida.disabled = false;
});

nextMatchBtn.addEventListener("click", () => {
  currentGameId++;
  clearBoard();
  game_btnReiniciarPartida.disabled = false;
});

function changenames() {
  if (currentPlayer == "X") {
    return jugador.innerHTML;
  } else {
    return maquina.innerHTML;
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winningCombinations.some((combination) => {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}
