import { PropsWithChildren, createContext, useEffect, useReducer } from "react";

import { gameReducer } from "./GameReducer";

import { BoardType, createEmptyBoard } from "../lib/board";
import {
  ActivePiece,
  getResetedActivePiece,
  PieceMap,
  PiecePositionZType,
} from "../lib/piece";

type GameState = "INITIAL" | "RUNNING" | "PAUSED" | "GAME OVER";
export interface GameContextType {
  state: GameState;
  board: BoardType;
  activePiece: ActivePiece;
  movePieceRight: () => void;
  movePieceLeft: () => void;
  movePieceDown: () => void;
  rotatePiece: () => void;
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
  currentPieceMap: () => [],
};

export const GameContext = createContext<GameContextType>(initialGameContext);

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

  const gameStateValue = {
    state: gameState.state,
    board: gameState.board,
    activePiece: gameState.activePiece,
    movePieceRight: movePieceRight,
    movePieceLeft: movePieceLeft,
    movePieceDown: movePieceDown,
    rotatePiece: rotatePiece,
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
