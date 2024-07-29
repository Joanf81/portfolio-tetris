import { PropsWithChildren, createContext, useEffect, useReducer } from "react";
import { boardColsNumber, boardRowsNumber } from "../config";
import {
  PieceColor,
  PieceMap,
  PiecePositionZType,
  blockType,
  boardType,
  pieceMapListType,
} from "../types";
import { nextPositionZ, randomPieceColor, randomPieceMap } from "../lib/pieces";
import {
  isCollisionAgainstBoardLimit as boardCollision,
  isCollisionAgainstPiece as pieceCollision,
} from "../lib/collisions";

function copyBoard(board: boardType) {
  return board.map((arr) => {
    return arr.slice();
  });
}

const emptyBoardLine: Array<blockType> = [];

for (let i = 0; i < boardColsNumber; i++) {
  if (i === 0 || i === boardColsNumber - 1) {
    emptyBoardLine.push("border");
  } else {
    emptyBoardLine.push("empty");
  }
}

function createEmptyBoard(): boardType {
  const emptyBoard: blockType[][] = [];

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

function getResetedActivePiece() {
  return {
    positionX: 1,
    positionY: 1,
    positionZ: PiecePositionZType.UP,
    color: randomPieceColor(),
    maps: randomPieceMap(),
  };
}

function addPieceToBoard(
  activePiece: ActivePiece,
  board: boardType
): boardType {
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

type GameState = "INITIAL" | "RUNNING" | "PAUSED" | "GAME OVER";
interface ActivePiece {
  maps: pieceMapListType;
  color: PieceColor;
  positionX: number;
  positionY: number;
  positionZ: PiecePositionZType;
}

export interface GameContextType {
  state: GameState;
  board: boardType;
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
          return { ...state, board: addPieceToBoard(activePiece, board) };
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
        return { ...state, positionZ: nextPositionZ(Z) };
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
  const [gameState, gameDispatch] = useReducer(gameReducer, initialGameContext);

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
