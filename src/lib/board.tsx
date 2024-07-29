import { boardColsNumber, boardRowsNumber } from "../config";
import { PieceColor } from "../types";

export type BlockType = PieceColor | "empty" | "border";
export type BoardType = BlockType[][];

export const emptyBoardLine: Array<BlockType> = [];

for (let i = 0; i < boardColsNumber; i++) {
  if (i === 0 || i === boardColsNumber - 1) {
    emptyBoardLine.push("border");
  } else {
    emptyBoardLine.push("empty");
  }
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
      if (
        y == 0 ||
        x == 0 ||
        y == boardRowsNumber - 1 ||
        x == boardColsNumber - 1
      ) {
        emptyBoard[y][x] = "border";
      } else {
        emptyBoard[y][x] = "empty";
      }
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

  return boardCopy;
}
