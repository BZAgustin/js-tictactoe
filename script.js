/* eslint-disable no-plusplus */

// Gameboard Factory
const Square = () => {
  let value = '';

  const addMarker = (marker) => {
    value = marker;
  };

  const getValue = () => value;

  return { addMarker, getValue };
}

const Gameboard = () => {
  const board = new Array(9);
  
  for(let i = 0; i < board.length; i++) {
    board[i] = Square();
  }  

  function placeMarker(index, playerMark) {
    board[index].addMarker(playerMark);
  }  

  return { board, placeMarker };
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

  return { hideOverlay }
}

// Game Controller
const GameController = () => {
  const players = new Array(2);
  const board = Gameboard();
  const display = DisplayController();

  function addPlayers(p1Shape, p2Shape) {
    players[0] = Player(p1Shape);
    players[1] = Player(p2Shape);
  }

  function selectShape() {
    document.getElementById('x').addEventListener('click', () => {
      addPlayers('X', 'O')
      display.hideOverlay();
    });

    document.getElementById('o').addEventListener('click', () => {
      addPlayers('O', 'X');
      display.hideOverlay();
    });
  }
  
  return { players, board, selectShape }
}


const game = GameController();
game.selectShape();