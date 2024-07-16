import { blockSize } from "./../config";
import { PieceMap, X, PieceType } from "../types";

import Block from "./Block";

// console.log(positionZ);
//     let log = "";
//     pieceMapList[positionZ].forEach((row) => {
//       row.forEach((e) => {
//         log += e + " ";
//       });
//       log += "\n";
//     });
//     console.log(log);

interface ActivePieceProps {
  pieceType: PieceType;
  pieceMap: PieceMap;
  positionX: number;
  positionY: number;
}

export default function ActivePiece({
  pieceType,
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
