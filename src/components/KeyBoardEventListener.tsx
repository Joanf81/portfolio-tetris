import { useContext, useEffect } from "react";
import { log } from "../log.js";
import { GameContext } from "../store/GameContext.js";

export default function KeyBoardEventListener() {
  const gameContext = useContext(GameContext);
  log("<KeyBoardEventListener /> rendered", 2);

  function handleKeyDown(e: KeyboardEvent): any {
    if (e.code === "ArrowRight") {
      gameContext.movePieceRight();
    } else if (e.code === "ArrowLeft") {
      gameContext.movePieceLeft();
    } else if (e.code === "ArrowDown") {
      gameContext.movePieceDown();
    } else if (e.code === "ArrowUp") {
      gameContext.rotatePiece();
    } else if (e.code === "KeyP") {
      gameContext.pauseGame();
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, false);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, false);
    };
  });

  return <></>;
}
