import { blockSize } from "./../config";
import { PieceMap, X, O, PieceType } from "../types";

import Block from "./Block";

interface ActivePieceProps {
  pieceType: PieceType;
  positionX: number;
  positionY: number;
  onNewPiece(pieceMap: PieceMap): void;
}

export default function ActivePiece({
  pieceType,
  positionX,
  positionY,
  onNewPiece,
}: ActivePieceProps) {
  const pieceMap: PieceMap = [
    [X, X, X],
    [X, O, O],
  ];

  const x = positionX * blockSize;
  const y = positionY * blockSize;

  const style = {
    "--position-x": `${x}px`,
    "--position-y": `${y}px`,
  } as React.CSSProperties;

  onNewPiece(pieceMap);

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
                  type={pieceType}
                ></Block>
              );
            }
          });
        })}
      </div>
    </div>
  );
}
