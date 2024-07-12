import { useState } from "react";
import { useRef } from "react";

import { boardColsNumber, boardRowsNumber, refreshRate } from "./config";

import Board from "./components/Board";
import ActivePiece from "./components/ActivePiece";
import { PieceMap, blockType, X } from "./types";

const EmptyBoard: blockType[][] = [];

for (let i = 0; i < boardRowsNumber; i++) {
  EmptyBoard[i] = [];
  for (let j = 0; j < boardColsNumber; j++) {
    EmptyBoard[i][j] = "empty";
  }
}

function App() {
  const gameTimerID = useRef<number>(0);
  const startedGame = useRef<boolean>(false);
  const activePieceMap = useRef<PieceMap>([]);
  const activePieceXSize = useRef<number>(0);
  const activePieceYSize = useRef<number>(0);

  const [board, setBoard] = useState<blockType[][]>(EmptyBoard);
  const [pieceX, setPieceX] = useState<number>(1);
  const [pieceY, setPieceY] = useState<number>(1);

  function newActivePieceCallback(pieceMap: PieceMap) {
    activePieceMap.current = pieceMap;
    activePieceXSize.current = pieceMap[0].length;
    activePieceYSize.current = pieceMap.length;
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
      setBoard((oldBoard) => {
        let newBoard: blockType[][] = [];

        newBoard = oldBoard.map((row) => {
          return row.slice();
        });

        activePieceMap.current.forEach((row, rowIndex) => {
          row.forEach((piece, colIndex) => {
            if (piece === X) {
              newBoard[pieceY + rowIndex][pieceX + colIndex] = "red";
            }
          });
        });

        return newBoard;
      });
      setPieceX(1);
      setPieceY(1);
      // pauseGame();
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
      <Board board={board}>
        <ActivePiece
          pieceType={"red"}
          positionX={pieceX}
          positionY={pieceY}
          onNewPiece={newActivePieceCallback}
        />
      </Board>
    </div>
  );
}

export default App;
