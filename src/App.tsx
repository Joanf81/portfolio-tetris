import { useState } from "react";
import { useRef, useEffect } from "react";

import { boardColsNumber, boardRowsNumber, refreshRate } from "./config";
import { PieceMap, blockType, X, Hash } from "./types";

import Board from "./components/Board";
import ActivePiece from "./components/ActivePiece";
import GameOverScreen from "./components/GameOverScreen";

const EmptyBoard: blockType[][] = [];

function initializeEmptyBoard() {
  for (let y = 0; y < boardRowsNumber; y++) {
    EmptyBoard[y] = [];
    for (let x = 0; x < boardColsNumber; x++) {
      if (
        y == 0 ||
        x == 0 ||
        y == boardRowsNumber - 1 ||
        x == boardColsNumber - 1
      ) {
        EmptyBoard[y][x] = "border";
      } else {
        EmptyBoard[y][x] = "empty";
      }
    }
  }
}

initializeEmptyBoard();

function App() {
  const gameTimerID = useRef<number>(0);
  const startedGame = useRef<boolean>(false);
  const activePieceMap = useRef<PieceMap>([]);
  const activePieceXSize = useRef<number>(0);
  const activePieceYSize = useRef<number>(0);

  const [board, setBoard] = useState<blockType[][]>(EmptyBoard);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [pieceX, setPieceX] = useState<number>(1);
  const [pieceY, setPieceY] = useState<number>(2);

  function newActivePieceCallback(pieceMap: PieceMap) {
    activePieceMap.current = pieceMap;
    activePieceXSize.current = pieceMap[0].length;
    activePieceYSize.current = pieceMap.length;
  }

  function movePieceRight() {
    if (
      pieceX + activePieceXSize.current < boardColsNumber - 1 &&
      !isCollisionAgainstPiece({ incrementX: 1 })
    ) {
      setPieceX((oldXPosition) => oldXPosition + 1);
    }
  }

  function movePieceLeft() {
    if (pieceX > 1 && !isCollisionAgainstPiece({ incrementX: -1 })) {
      setPieceX((oldXPosition) => oldXPosition - 1);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "ArrowRight") {
      movePieceRight();
    } else if (e.code === "ArrowLeft") {
      movePieceLeft();
    }
  }

  function isCollisionAgainstPiece(
    increments: Hash<"incrementX" | "incrementY", 1 | -1>
  ): boolean {
    let collision = false;
    const incrementX = increments["incrementX"] || 0;
    const incrementY = increments["incrementY"] || 0;

    activePieceMap.current.forEach((row, posY) => {
      row.forEach((block, posX) => {
        if (block === "X") {
          if (
            board[pieceY + posY + incrementY][pieceX + posX + incrementX] !=
            "empty"
          ) {
            collision = true;
          }
        }
      });
    });

    return collision;
  }

  function isCollisionAgainstBoardLimit(): boolean {
    return pieceY + activePieceYSize.current >= boardRowsNumber - 1;
  }

  function detectCollision() {
    if (
      isCollisionAgainstBoardLimit() ||
      isCollisionAgainstPiece({ incrementY: 1 })
    ) {
      // Collision against top limit
      if (pieceY <= 1) {
        gameOver();
      } else {
        addActivePieceToBoard();
        setPieceX(1);
        setPieceY(1);
      }
      return true;
    }
    return false;
  }

  function addActivePieceToBoard() {
    setBoard((oldBoard) => {
      let newBoard: blockType[][] = [];

      newBoard = oldBoard.map((row) => {
        return row.slice();
      });

      activePieceMap.current.forEach((row, posY) => {
        row.forEach((piece, poxX) => {
          if (piece === X) {
            newBoard[pieceY + posY][pieceX + poxX] = "red";
          }
        });
      });

      return newBoard;
    });
  }

  function gameOver() {
    stopGame();
    setIsGameOver(true);
  }

  function startGame() {
    if (!startedGame.current) {
      startedGame.current = true;
      gameTimerID.current = setInterval(() => {
        setPieceY((oldYPosition) => oldYPosition + 1);
      }, refreshRate);
    }
  }

  function stopGame() {
    if (startedGame.current) {
      clearInterval(gameTimerID.current);
      startedGame.current = false;
    }
  }

  function restartGame() {
    initializeEmptyBoard();
    setBoard(EmptyBoard);
    setPieceX(1);
    setPieceY(1);
    setIsGameOver(false);
    startGame();
  }

  // Game initialices the 1st time componenet gets rendered
  useEffect(() => {
    startGame();
  }, []);

  // Everytime Y postion on active piece gets updated:
  useEffect(() => {
    detectCollision();
  }, [pieceY]);

  console.log("Rendering (Y = " + pieceY + ")");

  return (
    <div tabIndex={1} className="bg-white" onKeyDown={handleKeyDown}>
      <Board board={board}>
        <GameOverScreen show={isGameOver} restartGame={restartGame} />
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
