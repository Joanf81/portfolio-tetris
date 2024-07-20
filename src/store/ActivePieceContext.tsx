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
import { isCollisionAgainstPiece as pieceCollision } from "../lib/collisions";
import { BoardContext } from "./BoardContext";
import { boardColsNumber } from "../config";

// const [pieceMap, setPieceMap] = useState<pieceMapListType>(randomPieceMap());
// const [pieceColor, setPieceColor] = useState<PieceColor>(randomPieceColor());
// const [pieceX, setPieceX] = useState<number>(1);
// const [pieceY, setPieceY] = useState<number>(2);
// const [pieceZ, setPieceZ] = useState<PiecePositionZType>(0);

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
}

type movePieceRightAction = {
  type: "MOVE_RIGHT";
  payload: { board: boardType };
};
type movePieceLeftAction = { type: "MOVE_LEFT"; payload: { board: boardType } };
type movePieceDownAction = { type: "MOVE_DOWN" };
type rotatePieceAction = { type: "ROTATE"; payload: { board: boardType } };

type activePieceActionType =
  | movePieceRightAction
  | movePieceLeftAction
  | rotatePieceAction
  | movePieceDownAction;

export const ActivePieceContext = createContext<ActivePieceContextType>({
  maps: { 0: [], 1: [], 2: [], 3: [] },
  color: "",
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  currentPieceMap: [],
  moveRight: () => {},
  moveLeft: () => {},
  moveDown: () => {},
  rotate: () => {},
});

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
        !pieceCollision(action.payload.board, maps[Z], X, Y, {
          incrementX: 1,
        })
      ) {
        return { ...state, positionX: X + 1 };
      }
      break;

    case "MOVE_LEFT":
      ({ board } = action.payload);

      if (
        X > 1 &&
        !pieceCollision(board, maps[Z], X, Y, {
          incrementX: -1,
        })
      ) {
        return { ...state, positionX: X - 1 };
      }
      break;

    case "MOVE_DOWN":
      return { ...state, positionY: Y + 1 };

    case "ROTATE":
      ({ board } = action.payload);
      const nextMap: PieceMap = maps[nextPositionZ(Z)];

      if (
        X + nextMap.length <= boardColsNumber - 1 &&
        !pieceCollision(board, nextMap, X, Y, {
          incrementX: 1,
        })
      ) {
        return { ...state, positionZ: nextPositionZ(Z) };
      } else {
        if (
          !pieceCollision(board, nextMap, X, Y, {
            incrementX: -1,
          })
        ) {
          return { ...state, positionX: X - 1, positionZ: nextPositionZ(Z) };
        }
      }
  }

  return state;
}

export default function ActivePieceContextProvider({
  children,
}: PropsWithChildren) {
  const initialRandomPieceMaps = randomPieceMap();
  const [activePieceState, activePieceDispatch] = useReducer(
    activePieceReducer,
    {
      maps: initialRandomPieceMaps,
      color: randomPieceColor(),
      positionX: 1,
      positionY: 2,
      positionZ: 0,
      currentPieceMap: initialRandomPieceMaps[0],
      moveRight: () => {},
      moveLeft: () => {},
      moveDown: () => {},
      rotate: () => {},
    }
  );

  const boardContext = useContext(BoardContext);

  function movePieceRight() {
    activePieceDispatch({
      type: "MOVE_RIGHT",
      payload: { board: boardContext.board },
    });
  }

  function movePieceLeft() {
    activePieceDispatch({
      type: "MOVE_LEFT",
      payload: { board: boardContext.board },
    });
  }

  function movePieceDown() {
    activePieceDispatch({ type: "MOVE_DOWN" });
  }

  function rotatePiece() {
    activePieceDispatch({
      type: "ROTATE",
      payload: { board: boardContext.board },
    });
  }

  const activePieceStateValue = {
    maps: activePieceState.maps,
    color: activePieceState.color,
    positionX: activePieceState.positionX,
    positionY: activePieceState.positionY,
    positionZ: activePieceState.positionZ,
    currentPieceMap: activePieceState.maps[activePieceState.positionZ],
    moveRight: movePieceRight,
    moveLeft: movePieceLeft,
    moveDown: movePieceDown,
    rotate: rotatePiece,
  };

  return (
    <ActivePieceContext.Provider value={activePieceStateValue}>
      {children}
    </ActivePieceContext.Provider>
  );
}
