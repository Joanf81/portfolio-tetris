import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
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
import { BoardContext, BoardContextType } from "./BoardContext";
import { boardColsNumber } from "../config";

interface ActivePieceContextType {
  maps: pieceMapListType;
  color: PieceColor;
  positionX: number;
  positionY: number;
  positionZ: PiecePositionZType;
  currentPieceMap: PieceMap;
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
    addPieceToBoard: BoardContextType["addPieceToBoard"];
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
  currentPieceMap: [],
  moveRight: () => {},
  moveLeft: () => {},
  moveDown: () => {},
  rotate: () => {},
  restart: () => {},
});

function activePieceReducer(
  state: ActivePieceContextType,
  action: activePieceActionType
) {
  const {
    maps,
    color,
    currentPieceMap,
    positionX: X,
    positionY: Y,
    positionZ: Z,
  } = state;
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
        isCollisionAgainstBoardLimit(currentPieceMap, Y) ||
        isCollisionAgainstPiece(board, currentPieceMap, X, Y, { incrementY: 1 })
      ) {
        // Collision agains top limit
        if (Y <= 1) {
          // setGameState("GAME OVER");
        } else {
          const actualColor = color;
          addPieceToBoard(currentPieceMap, X, Y, actualColor);
          return {
            ...state,
            positionX: 1,
            positionY: 1,
            positionZ: PiecePositionZType.UP,
            color: randomPieceColor(),
            maps: randomPieceMap(),
          };
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
        return {
          ...state,
          positionZ: nextPositionZ(Z),
          currentMap: maps[nextPositionZ(Z)],
        };
      } else if (!pieceCollision(board, nextMap, X, Y, { incrementX: -1 })) {
        return {
          ...state,
          positionX: X - 1,
          positionZ: nextPositionZ(Z),
          currentMap: maps[nextPositionZ(Z)],
        };
      }
      break;

    case "RESTART":
      return {
        ...state,
        positionX: 1,
        positionY: 1,
        positionZ: PiecePositionZType.UP,
        color: randomPieceColor(),
        maps: randomPieceMap(),
      };
  }

  return state;
}

export default function ActivePieceContextProvider({
  children,
}: PropsWithChildren) {
  const initialRandomPieceMaps = randomPieceMap();
  const [
    {
      color,
      currentPieceMap,
      positionX: X,
      positionY: Y,
      positionZ: Z,
      ...activePieceState
    },
    activePieceDispatch,
  ] = useReducer(activePieceReducer, {
    maps: initialRandomPieceMaps,
    color: randomPieceColor(),
    positionX: 1,
    positionY: 2,
    positionZ: PiecePositionZType.UP,
    currentPieceMap: initialRandomPieceMaps[0],
    moveRight: () => {},
    moveLeft: () => {},
    moveDown: () => {},
    rotate: () => {},
    restart: () => {},
  });

  const { board, ...boardContext } = useContext(BoardContext);

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
      payload: { board: board, addPieceToBoard: boardContext.addPieceToBoard },
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
    currentPieceMap: currentPieceMap,
    moveRight: movePieceRight,
    moveLeft: movePieceLeft,
    moveDown: movePieceDown,
    rotate: rotatePiece,
    restart: restartPiece,
  };

  return (
    <ActivePieceContext.Provider value={activePieceStateValue}>
      {children}
    </ActivePieceContext.Provider>
  );
}
