import { useState } from "react";
import { useRef } from "react";

import { boardColsNumber } from "./config";

import Board from "./components/Board";
import ActivePiece from "./components/ActivePiece";

function App() {
  const activePieceXSize = useRef<number>(0);
  const activePieceYSize = useRef<number>(0);

  const [pieceX, setPieceX] = useState<number>(1);

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

  return (
    <div tabIndex={1} className="bg-white" onKeyDown={handleKeyDown}>
      <Board>
        <ActivePiece
          positionX={pieceX}
          positionY={1}
          onNewPiece={newActivePieceCallback}
        />
      </Board>
    </div>
  );
}

export default App;
