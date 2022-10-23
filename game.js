// Part One: Make Game Into a Class
// Right now, our Connect Four is a bunch of disconnected functions and a few global variables.

// This can make it hard to see how things work, and would make it hard to restart a game (quick—which variables would you have to reset to start a game?)

// Let’s move this to being a class.

// Initially, we’ll start with one class, Game. The players will still just be numbers for player #1 and #2.

// What are the instance variables you’ll need on the Game?
// for example: height, width, and the board will move from global variables to instance attributes on the class. What else should move?
// Make a constructor that sets default values for these
// Move the current functions onto the class as methods
// This will require mildly rewriting some of these to change how you access variables and call other methods
// You should end up with all of the code being in the Game class, with the only other code being a single line at the bottom:

// new Game(6, 7); assuming constructor takes height, width

class Game {
  constructor(players = ['red', 'blue'], width = 7, height = 6) {
    this.players = [...players];
    this.currPlayer = 1;
    this.width = width;
    this.height = height;
    this.board = [];
    this.setPlayerColors(this.players);
    this.setPlayerColor(this.currPlayer);
  }

  makeBoard() {
    this.board = [];
    for (let i = 0; i < this.height; i++) this.board.push(new Array(this.width).fill(0));
    this.makeHtmlBoard();
  }

  makeHtmlBoard() {
    const htmlBoard = document.querySelector("#board");

    // Create the top table row with:
    //  id='column-top'
    //  click event => handleClick function.
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    this.handleGameClick = this.handleClick.bind(this);
    this.toggleGamePiece = this.togglePiece.bind(this);

    htmlBoard.addEventListener("click", this.handleGameClick);
    htmlBoard.addEventListener("mouseover", this.toggleGamePiece);
    htmlBoard.addEventListener("mouseout", this.toggleGamePiece);

    // Create individual cells and append to the top table row
    // With variable id attributes 'col-n'
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", "col-" + x);
      top.append(headCell);
    }

    htmlBoard.append(top);

    // Create individual cells in a HEIGHT x WIDTH array.
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `cell-${y}-${x}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }

  clearBoard() {
    const boardDiv = document.querySelector("#board");
    boardDiv.innerHTML = '';
  }

  handleClick(event) {
    
    // Checks for ensuring valid target element.
    let currElement = event.target;
    if (currElement.matches('table')) return;
    if (currElement.matches('div')) currElement = currElement.parentNode;

    // Extracts column index from id.
    let columnIndex = currElement.id.split("-");
    if (columnIndex[0] == 'cell') columnIndex = columnIndex[2];
    else columnIndex = columnIndex[1];

    // Gets next spot in column (if none, ignore click)
    let rowIndex = this.findSpotForCol(columnIndex);
    if (rowIndex === null) return;

    // place piece in Board and add to HTML table
    this.placeInTable(rowIndex, columnIndex);

    // check for win
    if (this.checkForWin(this.currPlayer)) return this.endGame(`Player ${this.currPlayer} won!`);

    // check for tie
    // If every element is !== 0, End with a tie.
    if (this.board.every((row) => row.every((element) => element))) return endGame(`The game is tied!`);

    // switch players
    // switch currPlayer 1 <-> 2
    if (this.currPlayer === this.players.length) this.currPlayer = 1;
    else this.currPlayer++;

    this.setPlayerColor(this.currPlayer);
  }

  togglePiece(event) {
    let targetElement = event.target;

    // Use element.matches();
    if (targetElement.matches("table")) return;
    if (targetElement.matches("div")) targetElement = targetElement.parentNode;

    const targetIdArray = targetElement.id.split("-");
    const columnIndex = targetIdArray.length;
    const columnTop = document.querySelector(
      "#col-" + targetIdArray[columnIndex - 1]
    );
    columnTop.classList.toggle("piece");
  }

  setPlayerColors(players) {
    const styleSheet = document.styleSheets[0];
    for(let player of players){
      const selector = `.player-${player.number}`;
      const color = player.color;
      styleSheet.insertRule(`${selector} \{ background-color: ${color};\}`);
    }
  }

  setPlayerColor(player) {
    const playerIndex = player - 1;
    const rootProperty = document.querySelector(":root");
    console.log(this.players[playerIndex].color);
    rootProperty.style.setProperty("--player-color", this.players[playerIndex].color);
  }

  placeInTable(row, col) {
    const pieceDiv = document.createElement("div");
    pieceDiv.classList.add("player-" + this.currPlayer);
    pieceDiv.classList.add("piece");
    const emptyCellDiv = document.querySelector("#cell-" + row + "-" + col);
    emptyCellDiv.append(pieceDiv);
    this.board[row][col] = this.currPlayer;
  }

  // Finds empty y coord for a given x coord.
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) return y;
    }
    return null;
  }

  _win(cells, currPlayer) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        this.board[y][x] === currPlayer
    );
  }

  createCheckArrays(y, x) {
    // Transverses along a single [y] array for 4 elements [x + n].
    const horiz = [
      [y, x],
      [y, x + 1],
      [y, x + 2],
      [y, x + 3],
    ];
    // Transverse through the arrays for 4 elements, going down through the [y] arrays.
    const vert = [
      [y, x],
      [y + 1, x],
      [y + 2, x],
      [y + 3, x],
    ];
    // Tranverses through the arrays for 4 elements, going down and right every time.
    const diagDR = [
      [y, x],
      [y + 1, x + 1],
      [y + 2, x + 2],
      [y + 3, x + 3],
    ];
    // Tranverses through the arrays for 4 elements, going down and left every time.
    const diagDL = [
      [y, x],
      [y + 1, x - 1],
      [y + 2, x - 2],
      [y + 3, x - 3],
    ];
    return [horiz, vert, diagDR, diagDL];
  }

  checkForWin(currPlayer) {
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if (this.board[y][x] == 0) continue;
        const checkArr = this.createCheckArrays(y, x);
        // Coalesces to true of any of these array of coords return a win.
        if (checkArr.some((arr) => this._win(arr, currPlayer))) return true;
      }
    }
  }

  removeListeners() {
    const htmlBoard = document.querySelector("#board");
    htmlBoard.removeEventListener("click", this.handleGameClick);
    htmlBoard.removeEventListener("mouseover", this.toggleGamePiece);
    htmlBoard.removeEventListener("mouseout", this.toggleGamePiece);
  }

  endGame(msg) {
    this.removeListeners();
    // TODO: pop up alert message
    alert(msg);
  }
}