import { boardColsNumber } from "../config";

import { GameContextType } from "./GameContext";

import { addPieceToBoard } from "../lib/board";
import { PieceMap, getResetedActivePiece, nextPositionZ } from "../lib/piece";
import {
  checkCollisionAgainstBoardLimit as boardCollision,
  checkCollisionAgainstPiece as pieceCollision,
} from "../lib/collisions";

type setGameStateRunning = { type: "SET_RUNNING" };
type movePieceRightAction = {
  type: "MOVE_RIGHT";
};
type movePieceLeftAction = { type: "MOVE_LEFT" };
type movePieceDownAction = {
  type: "MOVE_DOWN";
};
type rotatePieceAction = { type: "ROTATE" };

type gameActionType =
  | setGameStateRunning
  | movePieceRightAction
  | movePieceLeftAction
  | rotatePieceAction
  | movePieceDownAction;

export function gameReducer(state: GameContextType, action: gameActionType) {
  const { board, activePiece } = state;
  const { maps, positionX: X, positionY: Y, positionZ: Z } = activePiece;

  switch (action.type) {
    // case "EMPTY_BOARD":
    //   board = createEmptyBoard();
    //   break;

    case "MOVE_RIGHT":
      if (
        X + maps[Z][0].length < boardColsNumber - 1 &&
        !pieceCollision(board, activePiece, { incrementX: 1 })
      ) {
        return { ...state, activePiece: { ...activePiece, positionX: X + 1 } };
      }
      break;

    case "MOVE_LEFT":
      if (X > 1 && !pieceCollision(board, activePiece, { incrementX: -1 })) {
        return { ...state, activePiece: { ...activePiece, positionX: X - 1 } };
      }
      break;

    case "MOVE_DOWN":
      if (
        boardCollision(activePiece) ||
        pieceCollision(board, activePiece, { incrementY: 1 })
      ) {
        // Collision against top limit
        if (Y <= 1) {
          // setGameState("GAME OVER");
        } else {
          const newBoard = addPieceToBoard(activePiece, board);
          const newActivePiece = getResetedActivePiece();

          return { ...state, board: newBoard, activePiece: newActivePiece };
        }
      } else {
        return { ...state, activePiece: { ...activePiece, positionY: Y + 1 } };
      }
      break;

    case "ROTATE":
      const nextZ = nextPositionZ(Z);
      const nextMap: PieceMap = maps[nextZ];
      const borderDistance = boardColsNumber - 1 - (X + nextMap[0].length);

      // If there is no collision against right border and against any piece
      if (borderDistance >= 0 && !pieceCollision(board, activePiece, {})) {
        return { ...state, activePiece: { ...activePiece, positionZ: nextZ } };
      } else if (borderDistance < 0) {
        if (
          !pieceCollision(board, activePiece, { incrementX: borderDistance })
        ) {
          return {
            ...state,
            activePiece: {
              ...activePiece,
              positionX: X + borderDistance,
              positionZ: nextZ,
            },
          };
        }
      }
      break;
  }
  // case "SET_RUNNING":
  //   if (state.state == "GAME OVER") {
  //     boardContext.emptyBoard();
  //     activePieceContext.restart();
  //   }
  //   break;

  return state;
}
