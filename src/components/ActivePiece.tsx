import { blockSize } from "./../config";
import { PieceMap, X, PieceColor } from "../types";

import Block from "./Block";
import { useContext } from "react";
import { ActivePieceContext } from "../store/ActivePieceContext";

interface ActivePieceProps {
  PieceColor: PieceColor;
  positionY: number;
}

export default function ActivePiece({
  PieceColor,
  positionY,
}: ActivePieceProps) {
  const activePieceContext = useContext(ActivePieceContext);

  const x = activePieceContext.positionX * blockSize;
  const y = positionY * blockSize;

  const style = {
    "--position-x": `${x}px`,
    "--position-y": `${y}px`,
  } as React.CSSProperties;

  return (
    <div
      style={style}
      className={`z-20 absolute top-[var(--position-y)] left-[var(--position-x)]`}
    >
      <div className="relative">
        {activePieceContext.currentPieceMap.map((row, rowIndex) => {
          return row.map((piece, colIndex) => {
            if (piece === X) {
              return (
                <Block
                  absolute
                  positionX={colIndex}
                  positionY={rowIndex}
                  type={PieceColor}
                ></Block>
              );
            }
          });
        })}
      </div>
    </div>
  );
}
