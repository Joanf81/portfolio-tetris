import { boardColsNumber, boardRowsNumber } from "../config";
import { BlockType } from "./block";
import { ActivePiece } from "./piece";

export type BoardType = BlockType[][];

export const emptyBoardLine: Array<BlockType> = [];

for (let i = 0; i < boardColsNumber; i++) {
  emptyBoardLine.push("empty");
}

export function copyBoard(board: BoardType) {
  return board.map((arr) => {
    return arr.slice();
  });
}

export function createEmptyBoard(): BoardType {
  const emptyBoard: BlockType[][] = [];

  for (let y = 0; y < boardRowsNumber; y++) {
    emptyBoard[y] = [];
    for (let x = 0; x < boardColsNumber; x++) {
      emptyBoard[y][x] = "empty";
    }
  }
  return emptyBoard;
}

export function addPieceToBoard(
  activePiece: ActivePiece,
  board: BoardType
): BoardType {
  const boardCopy = copyBoard(board);
  const { maps, positionX: X, positionY: Y, positionZ: Z, color } = activePiece;

  maps[Z].forEach((row, posY) => {
    row.forEach((piece, poxX) => {
      if (piece === "X") {
        boardCopy[Y + posY][X + poxX] = color;
      }
    });
  });

  return detectAndRemoveCompletedLines(boardCopy);
}

function detectAndRemoveCompletedLines(board: BoardType): BoardType {
  let boardCopy = null;

  board.forEach((row, rowIndex) => {
    if (row.every((e) => e != "empty")) {
      boardCopy ||= copyBoard(board);
      boardCopy.splice(rowIndex, 1);
      boardCopy.splice(1, 0, emptyBoardLine);
    }
  });

  return boardCopy || board;
}
