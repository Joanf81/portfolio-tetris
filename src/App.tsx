import { useState } from "react";
import { useRef } from "react";

import { boardColsNumber, refreshRate } from "./config";

import Board from "./components/Board";
import ActivePiece from "./components/ActivePiece";

function App() {
  const startedGame = useRef<boolean>(false);
  const activePieceXSize = useRef<number>(0);
  const activePieceYSize = useRef<number>(0);

  const [pieceX, setPieceX] = useState<number>(1);
  const [pieceY, setPieceY] = useState<number>(1);

  function newActivePieceCallback(xSize: number, ySize: number) {
    activePieceXSize.current = xSize;
    // activePieceYSize.current = ySize;
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

  function gameLoop() {
    setPieceY((oldYPosition) => {
      console.log(oldYPosition);
      let newYPosition = oldYPosition;
      newYPosition += 1;

      return newYPosition;
    });
  }

  function startGame() {
    if (!startedGame.current) {
      startedGame.current = true;
      setInterval(gameLoop, refreshRate);
    }
  }

  startGame();

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
