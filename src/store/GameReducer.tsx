import { boardColsNumber } from "../config";

import { GameContextType } from "./GameContext";

import { addPieceToBoard, createEmptyBoard } from "../lib/board";
import { getResetedActivePiece, nextPositionZ } from "../lib/piece";
import {
  checkCollision,
  checkPieceCollision as pieceCollision,
} from "../lib/collisions";

type setGameStateRunning = { type: "START_GAME" };
type setGameStatePaused = { type: "PAUSE_GAME" };

type movePieceRightAction = { type: "MOVE_RIGHT" };
type movePieceLeftAction = { type: "MOVE_LEFT" };
type movePieceDownAction = { type: "MOVE_DOWN" };
type rotatePieceAction = { type: "ROTATE" };

type gameActionType =
  | setGameStateRunning
  | setGameStatePaused
  | movePieceRightAction
  | movePieceLeftAction
  | rotatePieceAction
  | movePieceDownAction;

export function gameReducer(
  state: GameContextType,
  action: gameActionType
): GameContextType {
  const { gameState, board, activePiece } = state;
  const { maps, positionX: X, positionY: Y, positionZ: Z } = activePiece;

  switch (action.type) {
    case "START_GAME":
      if (gameState == "GAME_OVER") {
        const newBoard = createEmptyBoard();
        const newActivePiece = getResetedActivePiece();

        return {
          ...state,
          gameState: "STARTED",
          board: newBoard,
          activePiece: newActivePiece,
        };
      }

      return { ...state, gameState: "STARTED" };

    case "PAUSE_GAME":
      return { ...state, gameState: "PAUSED" };

    case "MOVE_RIGHT":
      if (
        X + maps[Z][0].length < boardColsNumber &&
        !pieceCollision(board, activePiece, { incrementX: 1 })
      ) {
        return { ...state, activePiece: { ...activePiece, positionX: X + 1 } };
      }
      break;

    case "MOVE_LEFT":
      if (X > 0 && !pieceCollision(board, activePiece, { incrementX: -1 })) {
        return { ...state, activePiece: { ...activePiece, positionX: X - 1 } };
      }
      break;

    case "MOVE_DOWN":
      if (checkCollision(board, activePiece, { incrementY: 1 })) {
        // Collision against top limit
        if (Y <= 0) {
          return { ...state, gameState: "GAME_OVER" };
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
      const nextZActivePiece = { ...activePiece, positionZ: nextZ };
      const borderDistance = boardColsNumber - (X + maps[nextZ][0].length);

      // If there is no collision against right border and against any piece
      if (borderDistance >= 0 && !checkCollision(board, nextZActivePiece)) {
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

  return state;
}
