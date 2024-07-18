import { useContext, useState } from "react";
import { useRef, useEffect } from "react";

import {
  isCollisionAgainstBoardLimit,
  isCollisionAgainstPiece,
} from "../lib/collisions";
import { boardColsNumber, boardRowsNumber, refreshRate } from "../config";
import {
  PieceMap,
  blockType,
  boardType,
  PiecePositionZType,
  pieceMapListType,
  PieceColor,
} from "../types";
import usePrevious from "../hooks/usePrevious";

import Board from "../components/Board";
import ActivePiece from "../components/ActivePiece";
import GameOverScreen from "../components/GameOverScreen";
import PausedScreen from "../components/PausedScreen";
import { randomPieceMap, randomPieceColor } from "../lib/pieces";
import { BoardContext } from "../store/BoardContext";
import { ActivePieceContext } from "../store/ActivePieceContext";

type gameStateType = "INITIAL" | "RUNNING" | "PAUSED" | "GAME OVER";

function Game() {
  const gameTimerID = useRef<number>(0);
  const activePieceXSize = useRef<number>(0);

  const [gameState, setGameState] = useState<gameStateType>("INITIAL");
  const previousGameState = usePrevious(gameState);

  // const [board, setBoard] = useState<boardType>(emptyBoard);
  const boardContext = useContext(BoardContext);
  const activePieceContext = useContext(ActivePieceContext);

  const [pieceMap, setPieceMap] = useState<pieceMapListType>(randomPieceMap());
  const [pieceColor, setPieceColor] = useState<PieceColor>(randomPieceColor());
  const [pieceX, setPieceX] = useState<number>(1);
  const [pieceY, setPieceY] = useState<number>(2);
  const [pieceZ, setPieceZ] = useState<PiecePositionZType>(0);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "ArrowRight") {
      activePieceContext.moveRight();
    } else if (e.code === "ArrowLeft") {
      activePieceContext.moveLeft();
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
      activePieceContext.positionX + activePieceXSize <= boardColsNumber - 1 &&
      !isCollisionAgainstPiece(
        boardContext.board,
        nextPieceMap,
        activePieceContext.positionX,
        pieceY,
        {
          incrementX: 1,
        }
      )
    ) {
      setPieceZ(() => nextPieceType());
    } else {
      if (
        !isCollisionAgainstPiece(
          boardContext.board,
          nextPieceMap,
          activePieceContext.positionX,
          pieceY,
          {
            incrementX: -1,
          }
        )
      ) {
        setPieceZ(() => nextPieceType());
        setPieceX((oldXPosition) => oldXPosition - 1);
      }
    }
  }

  function detectCollision() {
    if (
      isCollisionAgainstBoardLimit(pieceMap[pieceZ], pieceY) ||
      isCollisionAgainstPiece(
        boardContext.board,
        pieceMap[pieceZ],
        activePieceContext.positionX,
        pieceY,
        {
          incrementY: 1,
        }
      )
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
    boardContext.addPieceToBoard(
      pieceMap[pieceZ],
      activePieceContext.positionX,
      pieceY,
      pieceColor
    );
    setPieceMap(randomPieceMap());
    setPieceZ(PiecePositionZType.UP);
    setPieceColor(randomPieceColor());
  }

  useEffect(() => {
    switch (gameState) {
      case "RUNNING":
        if (previousGameState == "GAME OVER") {
          boardContext.emptyBoard();
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
  }, [pieceY, activePieceContext.positionX]);

  // console.log("Rendering (Y = " + pieceY + ")");

  return (
    <div tabIndex={1} className="bg-white" onKeyDown={handleKeyDown}>
      <Board>
        <GameOverScreen
          show={gameState == "GAME OVER"}
          restartGame={() => setGameState("RUNNING")}
        />
        <PausedScreen
          show={gameState == "PAUSED"}
          resumeGame={() => setGameState("RUNNING")}
        />
        <ActivePiece
          PieceColor={pieceColor}
          pieceMap={pieceMap[pieceZ]}
          positionY={pieceY}
        />
      </Board>
    </div>
  );
}

export default Game;
