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
  const board = new Array(9);
  
  for(let i = 0; i < board.length; i++) {
    board[i] = Square();
  }  

  function placeMarker(index, playerMark) {
    board[index].addMarker(playerMark);
  }
  
  const getMarker = (index) => board[index].getMarker();

  return { board, placeMarker, getMarker };
}

// Player Factory
const Player = (playerMarker) => {
  const getMarker = () => playerMarker;

  return { getMarker }
}

// Display Controller
const DisplayController = () => {
  function hideOverlay() {
    document.querySelector('.ol-container').style.display = 'none';
  }

  function drawBoard(board) {
    for(const cell of board) {
      document.getElementById(`${board.indexOf(cell)}`).innerHTML = cell.getMarker();
    }
  }

  return { hideOverlay, drawBoard }
}

// Game Controller
const GameController = () => {
  const players = new Array(2);
  const gameboard = Gameboard();
  const display = DisplayController();
  let activePlayer;

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
      display.hideOverlay();
    });

    document.getElementById('o').addEventListener('click', () => {
      addPlayers('O', 'X');
      display.hideOverlay();
    });
  }

  function playerTurn(player, position) {
    if(gameboard.getMarker(position) !== '') {
      console.log('Cell is not empty!');
    } else {
      gameboard.placeMarker(position, player.getMarker());
      display.drawBoard(gameboard.board);
      switchActivePlayer();
    }
  }

  function initCells() {
    const board = gameboard.board;

    for(const cell of board) {
      document.getElementById(`${board.indexOf(cell)}`).addEventListener('click', () => {
        playerTurn(activePlayer, board.indexOf(cell));
      });
    }
  }
  
  return { players, gameboard, selectShape, initCells }
}

const game = GameController();
game.selectShape();
game.initCells();