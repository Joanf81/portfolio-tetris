import { useState } from "react";
import { useRef, useEffect } from "react";

import {
  isCollisionAgainstBoardLimit,
  isCollisionAgainstPiece,
} from "./lib/collisions";
import { boardColsNumber, boardRowsNumber, refreshRate } from "./config";
import { PieceMap, blockType, boardType, X, PiecePositionZType } from "./types";
import usePrevious from "./hooks/usePrevious";

import Board from "./components/Board";
import ActivePiece from "./components/ActivePiece";
import GameOverScreen from "./components/GameOverScreen";
import PausedScreen from "./components/PausedScreen";
import { AmmountOfPieceShapes } from "./lib/pieces";

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
  const activePieceMap = useRef<PieceMap>([]);
  const activePieceXSize = useRef<number>(0);
  const pieceShape = useRef<number>(
    Math.floor(Math.random() * AmmountOfPieceShapes) - 1
  );

  const [gameState, setGameState] = useState<gameStateType>("INITIAL");
  const previousGameState = usePrevious(gameState);

  const [board, setBoard] = useState<boardType>(emptyBoard);
  const [pieceX, setPieceX] = useState<number>(1);
  const [pieceY, setPieceY] = useState<number>(2);
  const [pieceZ, setPieceZ] = useState<PiecePositionZType>(0);

  function activePieceChangeHandler(
    pieceMap: PieceMap,
    positionX: number,
    positionZ: PiecePositionZType
  ) {
    if (positionX != pieceX) {
      setPieceX(positionX);
    }

    if (positionZ != pieceZ) {
      setPieceZ(positionZ);
    }

    if (pieceMap != activePieceMap.current) {
      activePieceMap.current = pieceMap;
    }
  }

  function movePieceRight() {
    if (
      pieceX + activePieceXSize.current < boardColsNumber - 1 &&
      !isCollisionAgainstPiece(board, activePieceMap.current, pieceX, pieceY, {
        incrementX: 1,
      })
    ) {
      setPieceX((oldXPosition) => oldXPosition + 1);
    }
  }

  function movePieceLeft() {
    if (
      pieceX > 1 &&
      !isCollisionAgainstPiece(board, activePieceMap.current, pieceX, pieceY, {
        incrementX: -1,
      })
    ) {
      setPieceX((oldXPosition) => oldXPosition - 1);
    }
  }

  function rotatePiece() {
    switch (pieceZ) {
      case PiecePositionZType.UP:
        setPieceZ(PiecePositionZType.RIGHT);
        break;
      case PiecePositionZType.RIGHT:
        setPieceZ(PiecePositionZType.DOWN);
        break;
      case PiecePositionZType.DOWN:
        setPieceZ(PiecePositionZType.LEFT);
        break;
      case PiecePositionZType.LEFT:
        setPieceZ(PiecePositionZType.UP);
        break;
    }
  }

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

  function detectCollision() {
    console.log("detecting");
    if (
      isCollisionAgainstBoardLimit(activePieceMap.current, pieceY) ||
      isCollisionAgainstPiece(board, activePieceMap.current, pieceX, pieceY, {
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

  useEffect(() => {
    switch (gameState) {
      case "RUNNING":
        if (previousGameState == "GAME OVER") {
          initializeEmptyBoard();
          setBoard(emptyBoard);
          pieceShape.current =
            Math.floor(Math.random() * AmmountOfPieceShapes) - 1;
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
          board={board}
          pieceType={"red"}
          pieceShape={pieceShape.current}
          positionX={pieceX}
          positionY={pieceY}
          positionZ={pieceZ}
          onChange={activePieceChangeHandler}
        />
      </Board>
    </div>
  );
}

export default App;
