import { createContext, useReducer } from "react";

type GameState = "INITIAL" | "RUNNING" | "PAUSED" | "GAME OVER";

export interface GameContextType {
  state: GameState;
}

export const GameContext = createContext<GameContextType>({
  state: "INITIAL",
});

type movePieceLeftAction = { type: "SET_RUNNING" };

type gameActionType = movePieceLeftAction;

function gameReducer(state: GameContextType, action: gameActionType) {
  return state;
}

export default function GameContextProvider() {
  const [gameState, gameStateDispatch] = useReducer(gameReducer, {
    state: "INITIAL",
  });

  return <GameContext.Provider value></GameContext.Provider>;
}
