import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  PieceColor,
  PieceMap,
  PiecePositionZType,
  boardType,
  pieceMapListType,
} from "../types";
import { nextPositionZ, randomPieceColor, randomPieceMap } from "../lib/pieces";
import {
  isCollisionAgainstBoardLimit,
  isCollisionAgainstPiece,
  isCollisionAgainstPiece as pieceCollision,
} from "../lib/collisions";
import { BoardContext } from "./BoardContext";
import { boardColsNumber } from "../config";

interface ActivePieceContextType {
  maps: pieceMapListType;
  color: PieceColor;
  positionX: number;
  positionY: number;
  positionZ: PiecePositionZType;
  currentMap: () => PieceMap;
  moveRight: () => void;
  moveLeft: () => void;
  moveDown: () => void;
  rotate: () => void;
  restart: () => void;
}

type movePieceRightAction = {
  type: "MOVE_RIGHT";
  payload: { board: boardType };
};
type movePieceLeftAction = { type: "MOVE_LEFT"; payload: { board: boardType } };
type movePieceDownAction = {
  type: "MOVE_DOWN";
  payload: {
    board: boardType;
    addPieceToBoard: () => void;
  };
};
type rotatePieceAction = { type: "ROTATE"; payload: { board: boardType } };
type restartPieceAction = { type: "RESTART" };

type activePieceActionType =
  | movePieceRightAction
  | movePieceLeftAction
  | rotatePieceAction
  | movePieceDownAction
  | restartPieceAction;

export const ActivePieceContext = createContext<ActivePieceContextType>({
  maps: { 0: [], 1: [], 2: [], 3: [] },
  color: "",
  positionX: 0,
  positionY: 0,
  positionZ: PiecePositionZType.UP,
  currentMap: () => {
    return [];
  },
  moveRight: () => {},
  moveLeft: () => {},
  moveDown: () => {},
  rotate: () => {},
  restart: () => {},
});

function getResetedActivePiece() {
  return {
    positionX: 1,
    positionY: 1,
    positionZ: PiecePositionZType.UP,
    color: randomPieceColor(),
    maps: randomPieceMap(),
  };
}

function activePieceReducer(
  state: ActivePieceContextType,
  action: activePieceActionType
) {
  const { maps, color, positionX: X, positionY: Y, positionZ: Z } = state;
  let board;

  switch (action.type) {
    case "MOVE_RIGHT":
      ({ board } = action.payload);

      if (
        X + maps[Z].length < boardColsNumber - 1 &&
        !pieceCollision(board, maps[Z], X, Y, { incrementX: 1 })
      ) {
        return { ...state, positionX: X + 1 };
      }
      break;

    case "MOVE_LEFT":
      ({ board } = action.payload);

      if (X > 1 && !pieceCollision(board, maps[Z], X, Y, { incrementX: -1 })) {
        return { ...state, positionX: X - 1 };
      }
      break;

    case "MOVE_DOWN":
      let addPieceToBoard;
      ({ board, addPieceToBoard } = action.payload);

      if (
        isCollisionAgainstBoardLimit(maps[Z], Y) ||
        isCollisionAgainstPiece(board, maps[Z], X, Y, { incrementY: 1 })
      ) {
        // Collision agains top limit
        if (Y <= 1) {
          // setGameState("GAME OVER");
        } else {
          addPieceToBoard();
          // return { ...state, ...getResetedActivePiece() };
        }
      } else {
        return { ...state, positionY: Y + 1 };
      }
      break;

    case "ROTATE":
      ({ board } = action.payload);
      const nextMap: PieceMap = maps[nextPositionZ(Z)];

      if (
        X + nextMap.length <= boardColsNumber - 1 &&
        !pieceCollision(board, nextMap, X, Y, { incrementX: 1 })
      ) {
        return { ...state, positionZ: nextPositionZ(Z) };
      } else if (!pieceCollision(board, nextMap, X, Y, { incrementX: -1 })) {
        return { ...state, positionX: X - 1, positionZ: nextPositionZ(Z) };
      }
      break;

    case "RESTART":
      return { ...state, ...getResetedActivePiece() };
  }

  return state;
}

export default function ActivePieceContextProvider({
  children,
}: PropsWithChildren) {
  const [
    { color, positionX: X, positionY: Y, positionZ: Z, ...activePieceState },
    activePieceDispatch,
  ] = useReducer(activePieceReducer, {
    ...getResetedActivePiece(),
    moveRight: () => {},
    moveLeft: () => {},
    moveDown: () => {},
    rotate: () => {},
    restart: () => {},
    currentMap: () => {
      return [];
    },
  });

  const { board, ...boardContext } = useContext(BoardContext);
  const [addPieceToBoard, setAddPieceToBoard] = useState(false);

  useEffect(() => {
    if (addPieceToBoard) {
      boardContext.addPieceToBoard(activePieceState.maps[Z], X, Y, color);
      setAddPieceToBoard(false);

      return () => {
        restartPiece();
      };
    }
  }, [addPieceToBoard]);

  function movePieceRight(): void {
    activePieceDispatch({
      type: "MOVE_RIGHT",
      payload: { board: board },
    });
  }

  function movePieceLeft() {
    activePieceDispatch({
      type: "MOVE_LEFT",
      payload: { board: board },
    });
  }

  function movePieceDown(): void {
    activePieceDispatch({
      type: "MOVE_DOWN",
      payload: {
        board: board,
        addPieceToBoard: () => {
          setAddPieceToBoard(true);
        },
      },
    });
  }

  function rotatePiece(): void {
    activePieceDispatch({
      type: "ROTATE",
      payload: { board: board },
    });
  }

  function restartPiece() {
    activePieceDispatch({ type: "RESTART" });
  }

  const activePieceStateValue = {
    maps: activePieceState.maps,
    color: color,
    positionX: X,
    positionY: Y,
    positionZ: Z,
    moveRight: movePieceRight,
    moveLeft: movePieceLeft,
    moveDown: movePieceDown,
    rotate: rotatePiece,
    restart: restartPiece,
    currentMap: () => {
      return activePieceState.maps[Z];
    },
  };

  return (
    <ActivePieceContext.Provider value={activePieceStateValue}>
      {children}
    </ActivePieceContext.Provider>
  );
}
