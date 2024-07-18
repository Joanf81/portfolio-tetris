import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";
import {
  PieceColor,
  PiecePositionZType,
  boardType,
  pieceMapListType,
} from "../types";
import { randomPieceColor, randomPieceMap } from "../lib/pieces";
import { isCollisionAgainstPiece } from "../lib/collisions";
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
  moveRight: () => void;
}

type movePieceRightAction = {
  type: "MOVE_RIGHT";
  payload: { board: boardType };
};
type movePieceLeftAction = { type: "MOVE_LEFT"; payload: { board: boardType } };

type activePieceActionType = movePieceRightAction | movePieceLeftAction;

export const ActivePieceContext = createContext<ActivePieceContextType>({
  maps: { 0: [], 1: [], 2: [], 3: [] },
  color: "",
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  moveRight: () => {},
});

function activePieceReducer(
  state: ActivePieceContextType,
  action: activePieceActionType
) {
  const { maps, color, positionX: X, positionY: Y, positionZ: Z } = state;

  switch (action.type) {
    case "MOVE_RIGHT":
      if (
        X + maps[Z].length < boardColsNumber - 1 &&
        !isCollisionAgainstPiece(action.payload.board, maps[Z], X, Y, {
          incrementX: 1,
        })
      ) {
        return { ...state, positionX: X + 1 };
      }
      break;
  }

  return state;
}

export default function ActivePieceContextProvider({
  children,
}: PropsWithChildren) {
  const [activePieceState, activePieceDispatch] = useReducer(
    activePieceReducer,
    {
      maps: randomPieceMap(),
      color: randomPieceColor(),
      positionX: 1,
      positionY: 2,
      positionZ: 0,
      moveRight: () => {},
    }
  );

  const boardContext = useContext(BoardContext);

  function movePieceRight() {
    activePieceDispatch({
      type: "MOVE_RIGHT",
      payload: { board: boardContext.board },
    });
  }

  const activePieceStateValue = {
    maps: activePieceState.maps,
    color: activePieceState.color,
    positionX: activePieceState.positionX,
    positionY: activePieceState.positionY,
    positionZ: activePieceState.positionZ,
    moveRight: movePieceRight,
  };

  return (
    <ActivePieceContext.Provider value={activePieceStateValue}>
      {children}
    </ActivePieceContext.Provider>
  );
}
