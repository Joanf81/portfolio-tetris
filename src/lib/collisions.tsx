import { boardRowsNumber } from "../config";
import { Hash } from "./types";
import { BoardType } from "./board";
import { ActivePiece } from "./piece";

export function checkCollisionAgainstPiece(
  board: BoardType,
  activePiece: ActivePiece,
  increments: Hash<"incrementX" | "incrementY", number> = {}
): boolean {
  let collision = false;

  const { positionX: pieceX, positionY: pieceY } = activePiece;
  const activePieceMap = activePiece.maps[activePiece.positionZ];

  const incrementX = increments["incrementX"] || 0;
  const incrementY = increments["incrementY"] || 0;

  activePieceMap.forEach((row, y) => {
    if (collision) return;

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

export function checkCollisionAgainstBoardLimit(
  activePiece: ActivePiece
): boolean {
  const activePieceMap = activePiece.maps[activePiece.positionZ];
  const pieceYSize = activePieceMap.length;

  return activePiece.positionY + pieceYSize >= boardRowsNumber;
}
