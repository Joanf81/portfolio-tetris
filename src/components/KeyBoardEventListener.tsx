import { useContext, useEffect } from "react";
import { ActivePieceContext } from "../store/ActivePieceContext";

export default function KeyBoardEventListener() {
  const activePieceContext = useContext(ActivePieceContext);

  function handleKeyDown(e: KeyboardEvent): any {
    if (e.code === "ArrowRight") {
      activePieceContext.moveRight();
    } else if (e.code === "ArrowLeft") {
      activePieceContext.moveLeft();
    } else if (e.code === "ArrowUp") {
      activePieceContext.rotate();
    } else if (e.code === "ArrowDown") {
      activePieceContext.moveDown();
    } else if (e.code === "KeyP") {
      if (gameState == "RUNNING") {
        setGameState("PAUSED");
      } else if (gameState == "PAUSED") {
        setGameState("RUNNING");
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, false);
  }, []);

  return <></>;
}
