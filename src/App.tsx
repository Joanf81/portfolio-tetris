import { useState } from "react";
import { useRef, useEffect } from "react";

import {
  isCollisionAgainstBoardLimit,
  isCollisionAgainstPiece,
} from "./lib/collisions";
import { boardColsNumber, boardRowsNumber, refreshRate } from "./config";
import {
  PieceMap,
  blockType,
  boardType,
  X,
  PiecePositionZType,
  pieceMapListType,
} from "./types";
import usePrevious from "./hooks/usePrevious";

import Board from "./components/Board";
import ActivePiece from "./components/ActivePiece";
import GameOverScreen from "./components/GameOverScreen";
import PausedScreen from "./components/PausedScreen";
import { randomPieceMap } from "./lib/pieces";

type gameStateType = "INITIAL" | "RUNNING" | "PAUSED" | "GAME OVER";

let emptyBoard: blockType[][] = [];

function initializeEmptyBoard() {
  for (let y = 0; y < boardRowsNumber; y++) {
    emptyBoard[y] = [];
    for (let x = 0; x < boardColsNumber; x++) {
      if (
        y == 0 ||
        x == 0 ||
        y == boardRowsNumber - 1 ||
        x == boardColsNumber - 1
      ) {
        emptyBoard[y][x] = "border";
      } else {
        emptyBoard[y][x] = "empty";
      }
    }
  }
}

function addWallToBoard() {
  const board = emptyBoard.map((row, y) => {
    return row.map((element, x) => {
      if (y > 5 && x === 8) {
        return "red";
      } else {
        return element;
      }
    });
  });

  emptyBoard = board;
}

initializeEmptyBoard();
addWallToBoard();

function App() {
  const gameTimerID = useRef<number>(0);
  const activePieceXSize = useRef<number>(0);

  const [gameState, setGameState] = useState<gameStateType>("INITIAL");
  const previousGameState = usePrevious(gameState);

  const [board, setBoard] = useState<boardType>(emptyBoard);
  const [pieceMap, setPieceMap] = useState<pieceMapListType>(randomPieceMap());
  const [pieceX, setPieceX] = useState<number>(1);
  const [pieceY, setPieceY] = useState<number>(2);
  const [pieceZ, setPieceZ] = useState<PiecePositionZType>(0);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "ArrowRight") {
      movePieceRight();
    } else if (e.code === "ArrowLeft") {
      movePieceLeft();
    } else if (e.code === "ArrowUp") {
      rotatePiece();
    } else if (e.code === "ArrowDown") {
      setPieceY((oldYPosition) => oldYPosition + 1);
    } else if (e.code === "KeyP") {
      if (gameState == "RUNNING") {
        setGameState("PAUSED");
      } else if (gameState == "PAUSED") {
        setGameState("RUNNING");
      }
    }
  }

  function movePieceRight() {
    if (
      pieceX + activePieceXSize.current < boardColsNumber - 1 &&
      !isCollisionAgainstPiece(board, pieceMap[pieceZ], pieceX, pieceY, {
        incrementX: 1,
      })
    ) {
      setPieceX((oldXPosition) => oldXPosition + 1);
    }
  }

  function movePieceLeft() {
    if (
      pieceX > 1 &&
      !isCollisionAgainstPiece(board, pieceMap[pieceZ], pieceX, pieceY, {
        incrementX: -1,
      })
    ) {
      setPieceX((oldXPosition) => oldXPosition - 1);
    }
  }

  function nextPieceType() {
    switch (pieceZ) {
      case PiecePositionZType.UP:
        return PiecePositionZType.RIGHT;
      case PiecePositionZType.RIGHT:
        return PiecePositionZType.DOWN;
      case PiecePositionZType.DOWN:
        return PiecePositionZType.LEFT;
      case PiecePositionZType.LEFT:
        return PiecePositionZType.UP;
    }
  }

  function rotatePiece() {
    const nextPieceMap: PieceMap = pieceMap[nextPieceType()];
    const activePieceXSize = nextPieceMap.length;

    if (
      pieceX + activePieceXSize <= boardColsNumber - 1 &&
      !isCollisionAgainstPiece(board, nextPieceMap, pieceX, pieceY, {
        incrementX: 1,
      })
    ) {
      setPieceZ(() => nextPieceType());
    } else {
      if (
        !isCollisionAgainstPiece(board, nextPieceMap, pieceX, pieceY, {
          incrementX: -1,
        })
      ) {
        setPieceZ(() => nextPieceType());
        setPieceX((oldXPosition) => oldXPosition - 1);
      }
    }
  }

  function detectCollision() {
    if (
      isCollisionAgainstBoardLimit(pieceMap[pieceZ], pieceY) ||
      isCollisionAgainstPiece(board, pieceMap[pieceZ], pieceX, pieceY, {
        incrementY: 1,
      })
    ) {
      // Collision against top limit
      if (pieceY <= 1) {
        setGameState("GAME OVER");
      } else {
        addActivePieceToBoard();
        setPieceX(1);
        setPieceY(1);
        setPieceZ(0);
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

      pieceMap[pieceZ].forEach((row, posY) => {
        row.forEach((piece, poxX) => {
          if (piece === X) {
            newBoard[pieceY + posY][pieceX + poxX] = "red";
          }
        });
      });

      return newBoard;
    });
    setPieceMap(randomPieceMap());
    setPieceZ(PiecePositionZType.UP);
  }

  useEffect(() => {
    switch (gameState) {
      case "RUNNING":
        if (previousGameState == "GAME OVER") {
          initializeEmptyBoard();
          setBoard(emptyBoard);
          setPieceMap(randomPieceMap());
          setPieceZ(PiecePositionZType.UP);
          setPieceX(1);
          setPieceY(1);
        }
        gameTimerID.current = setInterval(() => {
          setPieceY((oldYPosition) => oldYPosition + 1);
        }, refreshRate);
        break;
      case "PAUSED":
      case "GAME OVER":
        clearInterval(gameTimerID.current);
        break;
    }
  }, [gameState]);

  // Game initialices the 1st time componenet gets rendered
  useEffect(() => {
    setGameState("RUNNING");
  }, []);

  // Everytime Y postion on active piece gets updated:
  useEffect(() => {
    detectCollision();
  }, [pieceY]);

  // console.log("Rendering (Y = " + pieceY + ")");

  return (
    <div tabIndex={1} className="bg-white" onKeyDown={handleKeyDown}>
      <Board board={board}>
        <GameOverScreen
          show={gameState == "GAME OVER"}
          restartGame={() => setGameState("RUNNING")}
        />
        <PausedScreen
          show={gameState == "PAUSED"}
          resumeGame={() => setGameState("RUNNING")}
        />
        <ActivePiece
          pieceType={"red"}
          pieceMap={pieceMap[pieceZ]}
          positionX={pieceX}
          positionY={pieceY}
        />
      </Board>
    </div>
  );
}

export default App;
