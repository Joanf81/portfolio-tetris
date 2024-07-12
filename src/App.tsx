import { useState } from "react";
import { useRef } from "react";

import { boardColsNumber, boardRowsNumber, refreshRate } from "./config";

import Board from "./components/Board";
import ActivePiece from "./components/ActivePiece";

function App() {
  const gameTimerID = useRef<number>(0);
  const startedGame = useRef<boolean>(false);
  const activePieceXSize = useRef<number>(0);
  const activePieceYSize = useRef<number>(0);

  const [pieceX, setPieceX] = useState<number>(1);
  const [pieceY, setPieceY] = useState<number>(1);

  function newActivePieceCallback(xSize: number, ySize: number) {
    activePieceXSize.current = xSize;
    activePieceYSize.current = ySize;
  }

  function movePieceRight() {
    setPieceX((oldXPosition) => {
      let newXPosition = oldXPosition;

      if (oldXPosition + activePieceXSize.current < boardColsNumber - 1) {
        newXPosition += 1;
      }

      return newXPosition;
    });
  }

  function movePieceLeft() {
    setPieceX((oldXPosition) => {
      let newXPosition = oldXPosition;

      if (oldXPosition > 1) {
        newXPosition -= 1;
      }

      return newXPosition;
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "ArrowRight") {
      movePieceRight();
    } else if (e.code === "ArrowLeft") {
      movePieceLeft();
    }
  }

  function detectCollision() {
    // Collision againt board limit
    if (pieceY + activePieceYSize.current >= boardRowsNumber - 1) {
      pauseGame();
    }
  }

  function gameLoop() {
    setPieceY((oldYPosition) => {
      return oldYPosition + 1;
    });
  }

  function pauseGame() {
    if (startedGame.current) {
      clearInterval(gameTimerID.current);
    }
  }

  function startGame() {
    if (!startedGame.current) {
      startedGame.current = true;
      gameTimerID.current = setInterval(gameLoop, refreshRate);
    }
  }

  startGame();
  detectCollision();

  return (
    <div tabIndex={1} className="bg-white" onKeyDown={handleKeyDown}>
      <Board>
        <ActivePiece
          positionX={pieceX}
          positionY={pieceY}
          onNewPiece={newActivePieceCallback}
        />
      </Board>
    </div>
  );
}

export default App;
