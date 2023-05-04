/* eslint-disable no-use-before-define */
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
const Player = (marker) => {
  const getMarker = () => marker;

  return { getMarker }
}

const game = Gameboard();
const player1 = Player('X');

console.log(game.board);
console.log(player1.getMarker());
