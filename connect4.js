/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */



const WIDTH = 7;
const HEIGHT = 6;

let numPlayers = 3;

const gameDiv = document.querySelector("#game");
const boardDiv = document.querySelector("#board");
const titleHeader = document.createElement("h1");
const optionsDiv = document.createElement('div');

// Style Site with added Text and Elements
document.addEventListener("DOMContentLoaded", () => {

  optionsDiv.setAttribute('id', 'game-options');

  const newGameBtn = document.createElement('button');
  newGameBtn.setAttribute('id', 'new-game');
  newGameBtn.innerText = 'New Game';
  newGameBtn.addEventListener('click', newGameClick);
  newGameBtn.disabled = true;

  const numInput = document.createElement('input');
  numInput.setAttribute('id', 'num-players');
  numInput.setAttribute('placeholder', 'Number of Players');
  numInput.required = true;
  optionsDiv.append(numInput);

  const numPlayersBtn = document.createElement('button');
  numPlayersBtn.setAttribute('id', 'num-players-btn');
  numPlayersBtn.innerText = 'Submit';
  numPlayersBtn.addEventListener('click', generateInputs);
  optionsDiv.append(numPlayersBtn);

  const lineBreak = document.createElement('br');
  optionsDiv.append(lineBreak);

  optionsDiv.append(newGameBtn);
  titleHeader.innerText = "Gravitrips";
  gameDiv.insertBefore(titleHeader, boardDiv);
  gameDiv.insertBefore(optionsDiv, boardDiv);
});

function generateInputs(event) {
  const numInput = document.getElementById('num-players');
  const newGameBtn = document.getElementById('new-game');
  numPlayers = numInput.value;
  console.log(numPlayers);
  for(let i = 1; i <= numPlayers; i++) {
    const playerInput = document.createElement('input');
    playerInput.setAttribute('id', `player-${i}`);
    playerInput.setAttribute('placeholder', 'Player Color');
    playerInput.required = true;
    optionsDiv.insertBefore(playerInput, newGameBtn);
  }
  newGameBtn.disabled = false;
}

function newGameClick() {
  const playersArr = [];
  for(let i = 1; i <= numPlayers; i++) {
    playersArr.push(new Player(i, document.getElementById(`player-${i}`).value));
  }
  const game = new Game(playersArr);
  game.clearBoard();
  game.removeListeners();
  game.makeBoard();
}

// Part Two: Small Improvements
// Make it so that you have a button to “start the game” — it should only start the game when this is clicked, and you should be able to click this to restart a new game.

// Add a property for when the game is over, and make it so that you can’t continue to make moves after the game has ended.