import { PropsWithChildren, createContext, useEffect, useReducer } from "react";
import { boardColsNumber } from "../config";
import { PieceMap, PiecePositionZType, nextPositionZ } from "../lib/piece";
import {
  isCollisionAgainstBoardLimit as boardCollision,
  isCollisionAgainstPiece as pieceCollision,
} from "../lib/collisions";
import {
  BoardType,
  addPieceToBoard,
  copyBoard,
  createEmptyBoard,
  emptyBoardLine,
} from "../lib/board";
import { ActivePiece, getResetedActivePiece } from "../lib/piece";

type GameState = "INITIAL" | "RUNNING" | "PAUSED" | "GAME OVER";
export interface GameContextType {
  state: GameState;
  board: BoardType;
  activePiece: ActivePiece;
  movePieceRight: () => void;
  movePieceLeft: () => void;
  movePieceDown: () => void;
  rotatePiece: () => void;
  restartPiece: () => void;
  currentPieceMap: () => PieceMap;
}

const initialGameContext: GameContextType = {
  state: "INITIAL",
  board: [],
  activePiece: {
    maps: { 0: [], 1: [], 2: [], 3: [] },
    color: "",
    positionX: 0,
    positionY: 0,
    positionZ: PiecePositionZType.UP,
  },
  movePieceRight: () => {},
  movePieceLeft: () => {},
  movePieceDown: () => {},
  rotatePiece: () => {},
  restartPiece: () => {},
  currentPieceMap: () => [],
};

export const GameContext = createContext<GameContextType>(initialGameContext);

type setGameStateRunning = { type: "SET_RUNNING" };
type emptyLinesFromBoardAction = {
  type: "EMPTY_LINE";
  payload: { line: number };
};
type movePieceRightAction = {
  type: "MOVE_RIGHT";
};
type movePieceLeftAction = { type: "MOVE_LEFT" };
type movePieceDownAction = {
  type: "MOVE_DOWN";
};
type rotatePieceAction = { type: "ROTATE" };
type restartPieceAction = { type: "RESTART" };

type gameActionType =
  | setGameStateRunning
  | emptyLinesFromBoardAction
  | movePieceRightAction
  | movePieceLeftAction
  | rotatePieceAction
  | movePieceDownAction
  | restartPieceAction;

function gameReducer(state: GameContextType, action: gameActionType) {
  const { board, activePiece } = state;
  const { maps, positionX: X, positionY: Y, positionZ: Z } = activePiece;

  switch (action.type) {
    // case "EMPTY_BOARD":
    //   board = createEmptyBoard();
    //   break;

    case "EMPTY_LINE":
      const boardCopy = copyBoard(state.board);
      const { line } = action.payload;

      boardCopy.splice(line, 1);
      boardCopy.splice(1, 0, emptyBoardLine);

      return { ...state, board: boardCopy };

    case "MOVE_RIGHT":
      if (
        X + maps[Z][0].length < boardColsNumber - 1 &&
        !pieceCollision(board, maps[Z], X, Y, { incrementX: 1 })
      ) {
        return { ...state, activePiece: { ...activePiece, positionX: X + 1 } };
      }
      break;

    case "MOVE_LEFT":
      if (X > 1 && !pieceCollision(board, maps[Z], X, Y, { incrementX: -1 })) {
        return { ...state, activePiece: { ...activePiece, positionX: X - 1 } };
      }
      break;

    case "MOVE_DOWN":
      if (
        boardCollision(maps[Z], Y) ||
        pieceCollision(board, maps[Z], X, Y, { incrementY: 1 })
      ) {
        // Collision against top limit
        if (Y <= 1) {
          // setGameState("GAME OVER");
        } else {
          return {
            ...state,
            board: addPieceToBoard(activePiece, board),
            activePiece: getResetedActivePiece(),
          };
        }
      } else {
        return { ...state, activePiece: { ...activePiece, positionY: Y + 1 } };
      }
      break;

    case "ROTATE":
      const nextMap: PieceMap = maps[nextPositionZ(Z)];
      const borderDistance = boardColsNumber - 1 - (X + nextMap[0].length);

      // If there is no collision against right border and against any piece
      if (borderDistance >= 0 && !pieceCollision(board, nextMap, X, Y, {})) {
        return {
          ...state,
          activePiece: { ...activePiece, positionZ: nextPositionZ(Z) },
        };
      } else if (borderDistance < 0) {
        if (
          !pieceCollision(board, nextMap, X, Y, { incrementX: borderDistance })
        ) {
          return {
            ...state,
            activePiece: {
              ...activePiece,
              positionX: X + borderDistance,
              positionZ: nextPositionZ(Z),
            },
          };
        }
      }
      break;

    case "RESTART":
      return { ...state, activePiece: getResetedActivePiece() };
  }
  // case "SET_RUNNING":
  //   if (state.state == "GAME OVER") {
  //     boardContext.emptyBoard();
  //     activePieceContext.restart();
  //   }
  //   break;

  return state;
}

export default function GameContextProvider({ children }: PropsWithChildren) {
  const [gameState, gameDispatch] = useReducer(gameReducer, {
    ...initialGameContext,
    board: createEmptyBoard(),
    activePiece: getResetedActivePiece(),
  });

  function detectAndRemoveCompletedLines() {
    gameState.board.forEach((row, rowIndex) => {
      const rowWithoutBorders = row.slice(1, row.length - 1);
      if (rowWithoutBorders.every((e) => e != "border" && e != "empty"))
        gameDispatch({ type: "EMPTY_LINE", payload: { line: rowIndex } });
    });
  }

  useEffect(() => detectAndRemoveCompletedLines(), [gameState.board]);

  function movePieceRight(): void {
    gameDispatch({ type: "MOVE_RIGHT" });
  }

  function movePieceLeft() {
    gameDispatch({ type: "MOVE_LEFT" });
  }

  function movePieceDown(): void {
    gameDispatch({ type: "MOVE_DOWN" });
  }

  function rotatePiece(): void {
    gameDispatch({ type: "ROTATE" });
  }

  function restartPiece() {
    gameDispatch({ type: "RESTART" });
  }

  const gameStateValue = {
    state: gameState.state,
    board: gameState.board,
    activePiece: gameState.activePiece,
    movePieceRight: movePieceRight,
    movePieceLeft: movePieceLeft,
    movePieceDown: movePieceDown,
    rotatePiece: rotatePiece,
    restartPiece: restartPiece,
    currentPieceMap: () => {
      return gameState.activePiece.maps[gameState.activePiece.positionZ];
    },
  };

  return (
    <GameContext.Provider value={gameStateValue}>
      {children}
    </GameContext.Provider>
  );
}
