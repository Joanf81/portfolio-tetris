import { boardRowsNumber } from "../config";
import { Hash, PieceMap, boardType } from "../types";

export function isCollisionAgainstPiece(
  board: boardType,
  activePieceMap: PieceMap,
  pieceX: number,
  pieceY: number,
  increments: Hash<"incrementX" | "incrementY", 1 | -1>
): boolean {
  let collision = false;

  const incrementX = increments["incrementX"] || 0;
  const incrementY = increments["incrementY"] || 0;

  activePieceMap.forEach((row, y) => {
    if (collision) {
      return;
    }
    row.forEach((block, x) => {
      if (block === "X") {
        if (
          board[pieceY + y + incrementY][pieceX + x + incrementX] != "empty"
        ) {
          collision = true;
          return;
        }
      }
    });
  });

  return collision;
}

export function isCollisionAgainstBoardLimit(
  activePieceMap: PieceMap,
  pieceY: number
): boolean {
  const pieceYSize = activePieceMap.length;

  return pieceY + pieceYSize >= boardRowsNumber - 1;
}
