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
const Player = (playerMarker) => {

  const getMarker = () => playerMarker;

  return { getMarker }
}

// Display Controller
const DisplayController = () => {
  const toggleOverlay = () => {
    if(document.querySelector('.ol-container').style.display === 'none') {
      document.querySelector('.ol-container').style.display = 'flex';
    } else {
      document.querySelector('.ol-container').style.display = 'none'
    }
  }

  const switchOverlay = () => {
    if(document.querySelector('.overlay').style.display === 'none') {
      document.querySelector('.overlay').style.display = 'flex';
      document.querySelector('.overlay-2').style.display = 'none';
    } else {
      document.querySelector('.overlay').style.display = 'none';
      document.querySelector('.overlay-2').style.display = 'flex';
    }
  }

  const showEndScreen = (winner) => {
    toggleOverlay();
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.overlay-2').style.display = 'flex';
    document.getElementById('winner').textContent = `The winner is ${winner}!`;
  }

  const drawCell = (board, index) => {
    document.getElementById(`${index}`).innerHTML = board[index].getMarker();
  }

  return { toggleOverlay, switchOverlay, showEndScreen, drawCell }
}

// Game Controller
const GameController = () => {
  let players = new Array(2);
  let gameboard = Gameboard();
  const display = DisplayController();
  let activePlayer;
  let winner;

  function addPlayers(p1Shape, p2Shape) {
    players[0] = Player(p1Shape);
    players[1] = Player(p2Shape);
    activePlayer = players[0];
  };

  function switchActivePlayer() {
    if(activePlayer === players[0]) {
      activePlayer = players[1];
    } else {
      activePlayer = players[0];
    }
  }

  function selectShape() {
    document.getElementById('x').addEventListener('click', () => {
      addPlayers('X', 'O');
      display.toggleOverlay();
    });

    document.getElementById('o').addEventListener('click', () => {
      addPlayers('O', 'X');
      display.toggleOverlay();
    });
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

  function gameOver(player) {
    display.showEndScreen(player.getMarker());
  }

  function playerTurn(player, position) {
    if(gameboard.getMarker(position) !== '') {
      console.log('Cell is not empty!');
    } else {
      gameboard.placeMarker(position, player.getMarker());
      display.drawCell(gameboard.cells, position);
      winner = checkWinner();
      if(winner === players[0].getMarker()) {
        gameOver(players[0]);
      } else if (winner === players[1].getMarker()) {
        gameOver(players[1]);
      }
      switchActivePlayer();
    }
  }

  function initCells() {
    for(const cell of gameboard.cells) {
      document.getElementById(`${gameboard.cells.indexOf(cell)}`).addEventListener('click', () => {
        playerTurn(activePlayer, gameboard.cells.indexOf(cell));
      });
    }
  }

  function start() {
    selectShape();
    initCells();
  }

  // function restartGame() {

  //   display.switchOverlay();
  //   players = new Array(2);
  //   gameboard = Gameboard();
  // }
  
  return { players, gameboard, selectShape, start };
}

const game = GameController();
game.selectShape();
game.initCells();