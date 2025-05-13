const board = document.getElementById('chessboard');
const turnText = document.getElementById('turn');
let selectedSquare = null;
let currentPlayer = 'white';

const pieces = {
  r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟',
  R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙',
};

let initialSetup = [
  "rnbqkbnr",
  "pppppppp",
  "........",
  "........",
  "........",
  "........",
  "PPPPPPPP",
  "RNBQKBNR"
];

let squares = [];

function createBoard() {
  board.innerHTML = '';
  squares = [];

  for (let row = 0; row < 8; row++) {
    let rowArr = [];
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
      square.dataset.row = row;
      square.dataset.col = col;

      let char = initialSetup[row][col];
      if (char !== '.') {
        square.textContent = pieces[char];
      }

      square.addEventListener('click', () => handleClick(square));
      board.appendChild(square);
      rowArr.push(square);
    }
    squares.push(rowArr);
  }
}

function isWhite(piece) {
  return /[A-Z]/.test(piece);
}

function isBlack(piece) {
  return /[a-z]/.test(piece);
}

function pathClear(fRow, fCol, tRow, tCol) {
  let rowStep = Math.sign(tRow - fRow);
  let colStep = Math.sign(tCol - fCol);

  let row = fRow + rowStep;
  let col = fCol + colStep;

  while (row !== tRow || col !== tCol) {
    if (squares[row][col].textContent !== '') return false;
    row += rowStep;
    col += colStep;
  }
  return true;
}

function validMove(from, to) {
  const fRow = +from.dataset.row;
  const fCol = +from.dataset.col;
  const tRow = +to.dataset.row;
  const tCol = +to.dataset.col;

  const piece = from.textContent;
  const dx = tCol - fCol;
  const dy = tRow - fRow;

  const isTargetEmpty = to.textContent === '';
  const isCapture = (isWhite(piece) && isBlack(to.textContent)) || (isBlack(piece) && isWhite(to.textContent));

  switch (piece) {
    case '♙': // White pawn
      return (dx === 0 && dy === -1 && isTargetEmpty) ||
             (fRow === 6 && dy === -2 && dx === 0 && isTargetEmpty && squares[fRow - 1][fCol].textContent === '') ||
             (Math.abs(dx) === 1 && dy === -1 && isCapture);
    case '♟': // Black pawn
      return (dx === 0 && dy === 1 && isTargetEmpty) ||
             (fRow === 1 && dy === 2 && dx === 0 && isTargetEmpty && squares[fRow + 1][fCol].textContent === '') ||
             (Math.abs(dx) === 1 && dy === 1 && isCapture);
    case '♖': case '♜': // Rook
      if (dx === 0 || dy === 0)
        return pathClear(fRow, fCol, tRow, tCol);
      break;
    case '♘': case '♞': // Knight
      return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);
    case '♕': case '♛': // Queen
      if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy))
        return pathClear(fRow, fCol, tRow, tCol);
      break;
  }
  return false;
}

function handleClick(square) {
  if (selectedSquare) {
    selectedSquare.classList.remove('selected');

    if (square !== selectedSquare &&
        (square.textContent === '' || 
        (currentPlayer === 'white' && isBlack(square.textContent)) ||
        (currentPlayer === 'black' && isWhite(square.textContent)))) {

      if (validMove(selectedSquare, square)) {
        square.textContent = selectedSquare.textContent;
        selectedSquare.textContent = '';
        switchPlayer();
      }
    }

    selectedSquare = null;
  } else if (square.textContent !== '') {
    const piece = square.textContent;
    if ((currentPlayer === 'white' && isWhite(piece)) ||
        (currentPlayer === 'black' && isBlack(piece))) {
      selectedSquare = square;
      square.classList.add('selected');
    }
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
  turnText.textContent = `Giliran: ${currentPlayer === 'white' ? 'Putih' : 'Hitam'}`;
}

function resetGame() {
  currentPlayer = 'white';
  turnText.textContent = 'Giliran: Putih';
  createBoard();
}

createBoard();