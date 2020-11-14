'use strict';

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

/* Create a class "Game" which takes in the width, height, and starting player 
creates a game of Connect 4*/
`
class Game {
  //width, height, currentPlayer`
  // alternative solution: bring in global variables as default
	constructor(height, width, player1, player2) {
		this.height = height;
		this.width = width;
    this.currPlayer = player1;
    this.player1 = player1;
    this.player2 = player2;
		this.board = this.makeBoard();
		this.handleClick = this.handleClick.bind(this);
		this.makeHtmlBoard();
	}

	/** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

	makeBoard() {
		let board = [];
		for (let y = 0; y < this.height; y++) {
			board.push(Array.from({ length: this.width }));
		}
		return board;
	}

	/** makeHtmlBoard: make HTML table and row of column tops. */

	makeHtmlBoard() {
		const board = document.getElementById('board');

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');
		top.addEventListener('click', this.handleClick);

		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}

		board.append(top);

		// make main part of board
		for (let y = 0; y < this.height; y++) {
			const row = document.createElement('tr');

			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				row.append(cell);
			}

			board.append(row);
		}
	}

	/** findSpotForCol: given column x, return top empty y (null if filled) */

	findSpotForCol(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	/** placeInTable: update DOM to place piece into HTML table of board */

	placeInTable(y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer.playerNum}`);
    if (this.currPlayer.playerNum === this.player1.playerNum) {
      piece.style.backgroundColor = this.player1.color;
    }
    else {
      piece.style.backgroundColor = this.player2.color;
    }
		piece.style.top = -50 * (y + 2);

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}

	/** endGame: announce game end */

	endGame(msg) {
    const top = document.querySelector('#column-top');
    top.removeEventListener('click', this.handleClick);
		alert(msg);
	}

	/** handleClick: handle click of column top to play piece */

	handleClick(evt) {
		// get x from ID of clicked cell
		const x = +evt.target.id;
		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}
		// debugger;
		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer.playerNum;
		this.placeInTable(y, x);

		// check for win
		if (this.checkForWin()) {
			return this.endGame(`Player ${this.currPlayer.playerNum} won!`);
		}

		// check for tie
		if (this.board.every((row) => row.every((cell) => cell))) {
			return this.endGame('Tie!');
		}

		// switch players
		this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
	}

	/** checkForWin: check board cell-by-cell for "does a win start here?" */

	checkForWin() {
    // Alternative solution: arrow function rather than binding, or call _win with this
		function _win(cells) {
			//arrow function works too
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer
			console.log('this:', this);

			return cells.every(
				([ y, x ]) =>
					y >= 0 && y < this.height && x >= 0 && x < this.width && this.board[y][x] === this.currPlayer.playerNum
			);
		}

		const _winBind = _win.bind(this);

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
				const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
				const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
				const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

				// find winner (only checking each win-possibility as needed)
				if (_winBind(horiz) || _winBind(vert) || _winBind(diagDR) || _winBind(diagDL)) {
					return true;
				}
			}
		}
	}
}

/* create a Player class that takes in a string color and player number*/
class Player {
  constructor(color, playerNum) {
    this.color = color;
    this.playerNum = playerNum;
  }

}


/* create a new game. Add event listener on the form which creates two instances of players and creates an instance of game when submitted*/

//Refactor to name function rather than having an anonymous function
function createGameFromForm() {
  document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.querySelector('#board').innerHTML = ''; //use innerText. innerHTML is a security risk (similar to eval)
    
    let color1 = document.querySelector('#player1Color').value;
    let color2 = document.querySelector('#player2Color').value;
  
    let player1 = new Player(color1, 1);
    let player2 = new Player(color2, 2);
    new Game(6, 7, player1, player2);
  });
}

createGameFromForm();
