import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { useRef, useEffect } from "react";

import { refreshRate } from "../config";
import usePrevious from "../hooks/usePrevious";

import Board from "../components/Board";
import ActivePiece from "../components/ActivePiece";
import GameOverScreen from "../components/GameOverScreen";
import PausedScreen from "../components/PausedScreen";
import { BoardContext } from "../store/BoardContext";
import { ActivePieceContext } from "../store/ActivePieceContext";
import KeyBoardEventListener from "./KeyBoardEventListener";
import { log } from "../log.js";

type gameStateType = "INITIAL" | "RUNNING" | "PAUSED" | "GAME OVER";

export interface GameHandle {
  setGameOver: () => void;
}

interface GameProps {}

const Game = forwardRef<GameHandle, GameProps>(({}, ref) => {
  log("<Game /> rendered", 1);

  const gameTimerID = useRef<number>(0);

  const [gameState, setGameState] = useState<gameStateType>("INITIAL");
  const previousGameState = usePrevious(gameState);

  const boardContext = useContext(BoardContext);
  const activePieceContext = useContext(ActivePieceContext);

  useImperativeHandle(ref, () => ({
    setGameOver() {
      setGameState("GAME OVER");
    },
  }));

  useEffect(() => {
    switch (gameState) {
      case "RUNNING":
        if (previousGameState == "GAME OVER") {
          boardContext.emptyBoard();
          activePieceContext.restart();
        }
        break;
      case "PAUSED":
      case "GAME OVER":
        clearInterval(gameTimerID.current);
        break;
    }
  }, [gameState]);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     activePieceContext.moveDown();
  //   }, refreshRate);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [activePieceContext.positionY]);

  useEffect(() => {
    setGameState("RUNNING");
  }, []);

  return (
    <div tabIndex={1} className="bg-white">
      <KeyBoardEventListener />
      <GameOverScreen
        show={gameState == "GAME OVER"}
        restartGame={() => setGameState("RUNNING")}
      />
      <PausedScreen
        show={gameState == "PAUSED"}
        resumeGame={() => setGameState("RUNNING")}
      />
      <Board></Board>
      <ActivePiece />
    </div>
  );
});

export default Game;
