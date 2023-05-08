/* eslint-disable no-use-before-define */
/* eslint-disable no-loop-func */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */

// Gameboard Factory
const Square = () => {
  let value = '';

  const addMarker = (marker) => {
    value = marker;
  };

  const getMarker = () => value;

  return { addMarker, getMarker };
}

const Gameboard = () => {
  const cells = new Array(9);
  
  for(let i = 0; i < cells.length; i++) {
    cells[i] = Square();
  }

  function placeMarker(index, playerMark) {
    cells[index].addMarker(playerMark);
  }
  
  const getMarker = (index) => cells[index].getMarker();

  return { cells, placeMarker, getMarker };
}

// Player Factory
const Player = (playerName, playerMarker) => {
  const getName = () => playerName;
  const getMarker = () => playerMarker;

  return { getName, getMarker }
}

// Display Controller
const DisplayController = () => {
  const xButton = document.getElementById('x');
  const oButton = document.getElementById('o');
  const olContainer = document.querySelector('.ol-container');
  const overlay1 = document.querySelector('.overlay');
  const overlay2 = document.querySelector('.overlay-2');
  const cellContainer = document.querySelector('.cell-container');
  const cellDivs = new Array(9);

  for(let i = 0; i < cellDivs.length; i++) {
    cellDivs[i] = document.getElementById(`${i}`);
  }

  const toggleOverlay = () => {
    if(olContainer.style.display === 'none') {
      olContainer.style.display = 'flex';
    } else {
      olContainer.style.display = 'none';
    }
  }

  const switchOverlay = () => {
    if(overlay1.style.display === 'none') {
      overlay1.style.display = 'grid';
      overlay2.style.display = 'none';
    } else {
      overlay1.style.display = 'none';
      overlay2.style.display = 'flex';
    }
  }

  const showEndScreen = (winner) => {
    toggleOverlay();
    overlay1.style.display = 'none';
    overlay2.style.display = 'flex';
    if(winner !== null) {
      document.getElementById('winner').textContent = `${winner} is the winner!`;
    } else {
      document.getElementById('winner').textContent = `It's a draw! There is no winner`;
    }
  }

  const clearBoard = () => {
    const board = document.querySelector('.cell-container').children;

    for(const cell of board) {
      cell.innerHTML = '';
    }
  }

  const drawCell = (board, index) => {
    cellDivs[index].innerHTML = board[index].getMarker();
  }

  return { xButton, oButton, olContainer, 
           overlay1, overlay2, cellDivs, 
           cellContainer, toggleOverlay, switchOverlay, 
           showEndScreen, clearBoard, drawCell };
}

// Game Controller
const GameController = () => {
  let players = new Array(2);
  let gameboard = Gameboard();
  const display = DisplayController();
  let activePlayer;
  let winner;
  let round = 0;

  // Event handlers
  const cellHandler = (index) => {
    playerTurn(activePlayer, index);
  }

  const xButtonHandler = () => {
    addPlayers('Player 1', 'X', 'Player 2', 'O');
    display.toggleOverlay();
  }

  const oButtonHandler = () => {
    addPlayers('Player 1', 'O', 'Player 2', 'X');
    display.toggleOverlay();
  }

  function addPlayers(p1Name, p1Shape, p2Name, p2Shape) {
    players[0] = Player(p1Name, p1Shape);
    players[1] = Player(p2Name, p2Shape);
    activePlayer = players[0];
  };

  function switchActivePlayer() {
    if(activePlayer === players[0]) {
      activePlayer = players[1];
    } else {
      activePlayer = players[0];
    }
  }

  // Returns the marker of the winner, or null if there is none
  function checkWinner() { 
    const board = gameboard.cells;

    // Check rows
    for(let i = 0; i < 9; i += 3) {
      if(board[i].getMarker() !== '' &&
         board[i].getMarker() === board[i+1].getMarker() &&
         board[i+1].getMarker() === board[i+2].getMarker()) {
          return board[i].getMarker();
      }
    }

    // Check columns
    for(let j = 0; j < 3; j++) {
      if(board[j].getMarker() !== '' && 
         board[j].getMarker() === board[j+3].getMarker() &&
         board[j+3].getMarker() === board[j+6].getMarker()) {
          return board[j].getMarker();
         }
    }

    // Check diagonals
    if(board[0].getMarker() !== '' &&
       board[0].getMarker() === board[4].getMarker() &&
       board[4].getMarker() === board[8].getMarker()) {
        return board[0].getMarker();
       }
    
    if(board[2].getMarker() !== '' &&
       board[2].getMarker() === board[4].getMarker() &&
       board[4].getMarker() === board[6].getMarker()) {
        return board[2].getMarker();
       }

    return null;
  }

  function gameOver(player = null) {
    if(player !== null) {
      display.showEndScreen(player.getName());
    } else {
      display.showEndScreen(player);
    }
  }

  function playerTurn(player, position) {
    if(gameboard.getMarker(position) === '') {
      gameboard.placeMarker(position, player.getMarker());
      display.drawCell(gameboard.cells, position);
      winner = checkWinner();
      if(winner === players[0].getMarker()) {
        gameOver(players[0]);
      } else if (winner === players[1].getMarker()) {
        gameOver(players[1]);
      } else if (round === 8) {
        gameOver();
      } else {
        round += 1;
        switchActivePlayer();
      }
    }
  }

  function clearListeners() {
    for(const cell of gameboard.cells) {
      const index = gameboard.cells.indexOf(cell);
      display.cellDivs[index].removeEventListener('click', cellHandler.bind(this, index));
    }
  
    display.xButton.removeEventListener('click', xButtonHandler);
  
    display.oButton.removeEventListener('click', oButtonHandler);
    
    document.getElementById('restart').removeEventListener('click', restartGame);
  }
 
  function restartGame() {
    display.switchOverlay();
    display.clearBoard();
    players = new Array(2);
    gameboard = Gameboard();
    winner = null;
    round = 0;
    clearListeners();
    start();
  }

  function start() {
    display.xButton.addEventListener('click', xButtonHandler);

    display.oButton.addEventListener('click', oButtonHandler);

    for(const cell of gameboard.cells) {
      const index = gameboard.cells.indexOf(cell);
      display.cellDivs[index].addEventListener('click', cellHandler.bind(this, index));
    }
    
    document.getElementById('restart').addEventListener('click', restartGame);
  }
  
  return { players, gameboard, start };
}

const game = GameController();
game.start();