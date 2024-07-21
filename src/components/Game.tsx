import { useContext, useState } from "react";
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

type gameStateType = "INITIAL" | "RUNNING" | "PAUSED" | "GAME OVER";

function Game() {
  const gameTimerID = useRef<number>(0);

  const [gameState, setGameState] = useState<gameStateType>("INITIAL");
  const previousGameState = usePrevious(gameState);

  const boardContext = useContext(BoardContext);
  const activePieceContext = useContext(ActivePieceContext);

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

  useEffect(() => {
    const timer = setInterval(() => {
      activePieceContext.moveDown();
    }, refreshRate);

    return () => {
      clearInterval(timer);
    };
  }, [activePieceContext.positionY]);

  useEffect(() => {
    setGameState("RUNNING");
  }, []);

  return (
    <div tabIndex={1} className="bg-white">
      <KeyBoardEventListener />
      <Board>
        <GameOverScreen
          show={gameState == "GAME OVER"}
          restartGame={() => setGameState("RUNNING")}
        />
        <PausedScreen
          show={gameState == "PAUSED"}
          resumeGame={() => setGameState("RUNNING")}
        />
        <ActivePiece />
      </Board>
    </div>
  );
}

export default Game;
