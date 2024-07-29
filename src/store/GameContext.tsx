import { PropsWithChildren, createContext, useReducer } from "react";

import { gameReducer } from "./GameReducer";

import { BoardType, createEmptyBoard } from "../lib/board";
import {
  ActivePiece,
  getResetedActivePiece,
  PieceMap,
  PiecePositionZType,
} from "../lib/piece";

type GameState = "INITIAL" | "STARTED" | "PAUSED" | "GAME_OVER";
export interface GameContextType {
  gameState: GameState;
  board: BoardType;
  activePiece: ActivePiece;
  startGame: () => void;
  pauseGame: () => void;
  movePieceRight: () => void;
  movePieceLeft: () => void;
  movePieceDown: () => void;
  rotatePiece: () => void;
  currentPieceMap: () => PieceMap;
}

const initialGameContext: GameContextType = {
  gameState: "INITIAL",
  board: [],
  activePiece: {
    maps: { 0: [], 1: [], 2: [], 3: [] },
    color: "",
    positionX: 0,
    positionY: 0,
    positionZ: PiecePositionZType.UP,
  },
  startGame: () => {},
  pauseGame: () => {},
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

  function startGame(): void {
    gameDispatch({ type: "START_GAME" });
  }

  function pauseGame(): void {
    gameDispatch({ type: "PAUSE_GAME" });
  }

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
    gameState: gameState.gameState,
    board: gameState.board,
    activePiece: gameState.activePiece,
    startGame: startGame,
    pauseGame: pauseGame,
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
