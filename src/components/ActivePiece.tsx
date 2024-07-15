import { blockSize } from "./../config";
import { PieceMap, X, O, PieceType, PiecePositionZType } from "../types";

import Block from "./Block";
import { useEffect, useState } from "react";

interface ActivePieceProps {
  pieceType: PieceType;
  positionX: number;
  positionY: number;
  positionZ: PiecePositionZType;
  onNewPiece(pieceMap: PieceMap): void;
}

function transpose(matrix: PieceMap) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}

type pieceMapListType = {
  [key in PiecePositionZType]: PieceMap;
};

const pieceMap1: PieceMap = [
  [X, X, X],
  [X, O, O],
];

const pieceMapList: pieceMapListType = {
  0: pieceMap1,
  1: transpose(pieceMap1),
  2: pieceMap1.reverse(),
  3: transpose(pieceMap1).reverse(),
};

export default function ActivePiece({
  pieceType,
  positionX,
  positionY,
  positionZ,
  onNewPiece,
}: ActivePieceProps) {
  const x = positionX * blockSize;
  const y = positionY * blockSize;

  const [pieceMap, setPieceMap] = useState<PieceMap>(pieceMapList[positionZ]);

  const style = {
    "--position-x": `${x}px`,
    "--position-y": `${y}px`,
  } as React.CSSProperties;

  useEffect(() => {
    setPieceMap(pieceMapList[positionZ]);
    onNewPiece(pieceMap);
  }, [positionZ]);

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
