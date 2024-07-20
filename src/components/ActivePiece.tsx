import { blockSize } from "./../config";
import { X } from "../types";

import Block from "./Block";
import { useContext } from "react";
import { ActivePieceContext } from "../store/ActivePieceContext";

export default function ActivePiece() {
  const activePieceContext = useContext(ActivePieceContext);

  const x = activePieceContext.positionX * blockSize;
  const y = activePieceContext.positionY * blockSize;

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
                  type={activePieceContext.color}
                ></Block>
              );
            }
          });
        })}
      </div>
    </div>
  );
}
