import { blockSize } from "./../config";
import { PieceMap, X, PieceColor } from "../types";

import Block from "./Block";

interface ActivePieceProps {
  PieceColor: PieceColor;
  pieceMap: PieceMap;
  positionX: number;
  positionY: number;
}

export default function ActivePiece({
  PieceColor,
  pieceMap,
  positionX,
  positionY,
}: ActivePieceProps) {
  const x = positionX * blockSize;
  const y = positionY * blockSize;

  const style = {
    "--position-x": `${x}px`,
    "--position-y": `${y}px`,
  } as React.CSSProperties;

  console.log(PieceColor);

  return (
    <div
      style={style}
      className={`z-20 absolute top-[var(--position-y)] left-[var(--position-x)]`}
    >
      <div className="relative">
        {pieceMap.map((row, rowIndex) => {
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
