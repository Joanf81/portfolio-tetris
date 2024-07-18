import { PropsWithChildren, createContext, useReducer } from "react";
import { PieceColor, PiecePositionZType, pieceMapListType } from "../types";
import { randomPieceColor, randomPieceMap } from "../lib/pieces";

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
}

type activePieceActionType = "";

export const ActivePieceContext = createContext<ActivePieceContextType>({
  maps: { 0: [], 1: [], 2: [], 3: [] },
  color: "",
  positionX: 0,
  positionY: 0,
  positionZ: 0,
});

function activePieceReducer(
  state: ActivePieceContextType,
  action: activePieceActionType
) {
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
    }
  );

  const activePieceStateValue = {
    maps: activePieceState.maps,
    color: activePieceState.color,
    positionX: activePieceState.positionX,
    positionY: activePieceState.positionY,
    positionZ: activePieceState.positionZ,
  };

  return (
    <ActivePieceContext.Provider value={activePieceStateValue}>
      {children}
    </ActivePieceContext.Provider>
  );
}
