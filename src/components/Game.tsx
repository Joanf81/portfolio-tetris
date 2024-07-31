import { useContext } from "react";
import { useRef, useEffect } from "react";

import { refreshRate } from "../config";

import Board from "../components/Board";
import ActivePiece from "../components/ActivePiece";
import GameOverScreen from "../components/GameOverScreen";
import PausedScreen from "../components/PausedScreen";
import KeyBoardEventListener from "./KeyBoardEventListener";
import { log } from "../log.js";
import { GameContext } from "../store/GameContext.js";
import Background from "./Background.js";

export default function Game() {
  log("<Game /> rendered", 1);

  const gameTimerID = useRef<number>(0);
  const { gameState, startGame, ...gameContext } = useContext(GameContext);

  const isPaused = gameState === "PAUSED";
  const isGameOver = gameState === "GAME_OVER";

  useEffect(() => {
    if (gameState === "STARTED") {
      gameTimerID.current = setInterval(() => {
        gameContext.movePieceDown();
      }, refreshRate);
    }

    return () => {
      clearInterval(gameTimerID.current);
    };
  }, [gameContext.activePiece.positionY, gameState]);

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div tabIndex={1} className="bg-white">
      <KeyBoardEventListener />
      <Background />
      <Board>
        <ActivePiece />
        {isPaused && <PausedScreen onRestart={startGame} />}
        {isGameOver && <GameOverScreen onRestart={startGame} />}
      </Board>
    </div>
  );
}
