const POSITION = "3qk3/8/pppppppp/8/8/PPPPPPPP/8/3QK3 w - - 0 1";

const letterToIndexRow = (letter) => {
  return letter.charCodeAt(0) % 97;
};
const indexRowToLetter = (index) => {
  return String.fromCharCode(96 + index);
};

const canPawnAttack = (source, target) => {
  const boardPosition = board.position();
  if (
    parseInt(target[1]) - parseInt(source[1]) !== 1 ||
    source[0] === target[0]
  )
    return false;
  if (Boolean(boardPosition[target]) && boardPosition[target][0] === "w")
    return false;
  return Boolean(boardPosition[target]);
};

const canPawnMoveForward = (target, source) => {
  const boardPosition = board.position();
  return (
    !Boolean(boardPosition[target]) &&
    source[0] === target[0] &&
    parseInt(target[1]) - parseInt(source[1]) === 1
  );
};

const canKingMove = (target, source) => {
  if (Math.abs(letterToIndexRow(target[0]) - letterToIndexRow(source[0])) > 1)
    return false;
  if (Math.abs(letterToIndexRow(target[1]) - letterToIndexRow(source[1])) > 1)
    return false;
  const boardPosition = board.position();
  if (Boolean(boardPosition[target]) && boardPosition[target][0] === "w")
    return false;
  if (
    Math.abs(letterToIndexRow(target[1]) - letterToIndexRow(source[1])) === 1 &&
    Math.abs(letterToIndexRow(target[0]) - letterToIndexRow(source[0])) === 1
  )
    return false;
  return true;
};

const canQueenMove = (target, source) => {
  if (Math.abs(letterToIndexRow(target[0]) - letterToIndexRow(source[0])) > 1)
    return false;
  if (Math.abs(letterToIndexRow(target[1]) - letterToIndexRow(source[1])) > 1)
    return false;
  const boardPosition = board.position();
  if (Boolean(boardPosition[target]) && boardPosition[target][0] === "w")
    return false;
  return true;
};

const checkPromotion = (newBoardPosition, target, update, black = false) => {
  return new Promise((resolve, reject) => {
    if (black ? parseInt(target[1]) === 1 : parseInt(target[1]) === 8) {
      newBoardPosition[target] = black ? "bQ" : "wQ";
    }
    if (update) {
      updateBoard(newBoardPosition);
      resolve(newBoardPosition);
    }
    resolve(newBoardPosition);
  });
};

const updateBoard = (newBoardPosition) => {
  setTimeout(() => {
    board.position(newBoardPosition, false);
  }, 0);
};

const resetGame = (text) => {
  alert(text);
  setTimeout(() => {
    board.position(POSITION, false);
  }, 0);
};

const checkIfGameIsOver = (boardPos = board.position()) => {
  const numberOfKings = [];
  for (const [_, value] of Object.entries(boardPos)) {
    if (value === "bK" || value === "wK") {
      numberOfKings.push(value);
    }
  }
  console.log(numberOfKings);
  if (numberOfKings.length === 1) {
    setTimeout(() => {
      resetGame(
        `Wygrał kolor: ${numberOfKings[0] === "bK" ? "czarny" : "biały"}`
      );
    }, 50)

    return true;
  }
  return false;
};

let zeroMovesPiece = [];

const computerMove = (boardPos) => {
  let onlyBlackChessPieces = Object.fromEntries(
    Object.entries(boardPos).filter(([key, value]) => value[0] === "b")
  );
  onlyBlackChessPieces = Object.fromEntries(
    Object.entries(onlyBlackChessPieces).filter(
      ([key, value]) => !zeroMovesPiece.includes(key)
    )
  );
  if (onlyBlackChessPieces.length === 0)
    return resetGame("Brak ruchów dla czarnych, wygrał biały");

  const position =
    Object.keys(onlyBlackChessPieces)[
      Math.floor(Math.random() * Object.keys(onlyBlackChessPieces).length)
    ];
  const rowIndex = letterToIndexRow(position) + 1;
  const leftUpperRow = rowIndex - 1;
  const rightUpperRow = rowIndex + 1;
  const upperColumn = parseInt(position[1]) + 1;
  const bottomColumn = parseInt(position[1]) - 1;
  const possibleMoves = [];
  switch (boardPos[position]) {
    case "bP":
    case "bP":
      if (bottomColumn > 0 && !Boolean(boardPos[position[0] + bottomColumn])) {
        possibleMoves.push(position[0] + bottomColumn);
      }
      if (leftUpperRow > 0 && leftUpperRow < 9) {
        if (
          Boolean(boardPos[indexRowToLetter(leftUpperRow) + bottomColumn]) &&
          boardPos[indexRowToLetter(leftUpperRow) + bottomColumn][0][0] !== "b"
        ) {
          possibleMoves.push(indexRowToLetter(leftUpperRow) + bottomColumn);
        }
      }
      if (rightUpperRow > 0 && rightUpperRow < 9) {
        if (
          Boolean(boardPos[indexRowToLetter(rightUpperRow) + bottomColumn]) &&
          boardPos[indexRowToLetter(rightUpperRow) + bottomColumn][0][0] !== "b"
        ) {
          possibleMoves.push(indexRowToLetter(rightUpperRow) + bottomColumn);
        }
      }
      if (possibleMoves.length === 0) {
        zeroMovesPiece.push(position);
        return computerMove(boardPos);
      }
      zeroMovesPiece = [];
      const randomElement =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      delete boardPos[position];
      delete boardPos[randomElement];
      boardPos[randomElement] = "bP";
      checkPromotion(boardPos, randomElement, true, true);
      break;
    case "bK":
      const allowedMovesBK = [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
      ];
      for (let y = -1; y < allowedMovesBK.length - 1; y++) {
        if (
          (upperColumn === 9 && y === allowedMovesBK.length - 2) ||
          (bottomColumn === 0 && y === -1)
        )
          continue;
        for (let x = -1; x < allowedMovesBK[y + 1].length - 1; x++) {
          if (
            (leftUpperRow === 1 && x === -1) ||
            (rightUpperRow === 8 && x === allowedMovesBK[y + 1].length - 1)
          )
            continue;
          if (
            allowedMovesBK[y + 1][x + 1] === 1 &&
            (!boardPos[
                indexRowToLetter(rowIndex + x) + (parseInt(position[1]) + y)
              ] ||
              boardPos[
                indexRowToLetter(rowIndex + x) + (parseInt(position[1]) + y)
              ][0][0] !== "b")
          ) {
            possibleMoves.push(
              indexRowToLetter(rowIndex + x) + (parseInt(position[1]) + y)
            );
          }
        }
      }
      console.log(possibleMoves);
      if (possibleMoves.length === 0) {
        zeroMovesPiece.push(position);
        return computerMove(boardPos);
      }
      zeroMovesPiece = [];
      const randomElementBK =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      delete boardPos[position];
      delete boardPos[randomElementBK];
      boardPos[randomElementBK] = "bK";
      updateBoard(boardPos);
      break;
    case "bQ":
      const allowedMovesBQ = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ];
      for (let y = -1; y < allowedMovesBQ.length - 1; y++) {
        if (
          (upperColumn === 9 && y === allowedMovesBQ.length - 2) ||
          (bottomColumn === 0 && y === -1)
        )
          continue;
        for (let x = -1; x < allowedMovesBQ[y + 1].length - 1; x++) {
          if (
            (leftUpperRow === 1 && x === -1) ||
            (rightUpperRow === 8 && x === allowedMovesBQ[y + 1].length - 1)
          )
            continue;
          if (
            allowedMovesBQ[y + 1][x + 1] === 1 &&
            (!boardPos[
                indexRowToLetter(rowIndex + x) + (parseInt(position[1]) + y)
              ] ||
              boardPos[
                indexRowToLetter(rowIndex + x) + (parseInt(position[1]) + y)
              ][0][0] !== "b")
          ) {
            possibleMoves.push(
              indexRowToLetter(rowIndex + x) + (parseInt(position[1]) + y)
            );
          }
        }
      }
      console.log(possibleMoves);
      if (possibleMoves.length === 0) {
        zeroMovesPiece.push(position);
        return computerMove(boardPos);
      }
      zeroMovesPiece = [];
      const randomElementBQ =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      delete boardPos[position];
      delete boardPos[randomElementBQ];
      boardPos[randomElementBQ] = "bQ";
      updateBoard(boardPos);
      break;
  }
  setTimeout(() => {
    checkIfGameIsOver(boardPos);
  }, 100);
};

const onDrop = (source, target, piece, newPos, oldPos, orientation) => {
  if (source === target) return "snapback";
  switch (piece) {
    case "wP":
      if (canPawnMoveForward(target, source)) {
        if (checkIfGameIsOver(newPos)) {
          return;
        }
        checkPromotion(newPos, target, false).then((newPos) => {
          computerMove(newPos);
        });
      } else if (canPawnAttack(source, target)) {
        if (checkIfGameIsOver(newPos)) {
          return;
        }
        checkPromotion(newPos, target, false).then((newPos) =>
          computerMove(newPos)
        );
      } else {
        return "snapback";
      }
      break;
    case "wK":
      if (canKingMove(target, source)) {
        if (checkIfGameIsOver(newPos)) {
          return;
        }
        computerMove(newPos);
      } else {
        return "snapback";
      }
      break;
    case "wQ":
      if (canQueenMove(target, source)) {
        if (checkIfGameIsOver(newPos)) {
          return;
        }
        computerMove(newPos);
      } else {
        return "snapback";
      }
      break;
    default:
      alert("Error occurred");
      resetGame();
  }
};

const onDragStart = (source, piece, position, orientation) => {
  if (
    (orientation === "white" && piece.search(/^w/) === -1) ||
    (orientation === "black" && piece.search(/^b/) === -1)
  ) {
    return false;
  }
};

const config = {
  draggable: true,
  position: POSITION,
  onDragStart: onDragStart,
  onDrop: onDrop,
};
const board = Chessboard("myBoard", config);
