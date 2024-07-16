import { blockSize, boardColsNumber } from "./../config";
import {
  PieceMap,
  X,
  O,
  PieceType,
  PiecePositionZType,
  boardType,
} from "../types";

import Block from "./Block";
import { useEffect, useState } from "react";
import { isCollisionAgainstPiece } from "../lib/collisions";
import { listOfMaps } from "../lib/pieces";

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
  board: boardType;
  pieceType: PieceType;
  pieceShape: number;
  positionX: number;
  positionY: number;
  positionZ: PiecePositionZType;
  onChange(
    pieceMap: PieceMap,
    positionX: number,
    positionZ: PiecePositionZType
  ): void;
}

export default function ActivePiece({
  board,
  pieceType,
  pieceShape,
  positionX,
  positionY,
  positionZ,
  onChange,
}: ActivePieceProps) {
  const x = positionX * blockSize;
  const y = positionY * blockSize;

  const pieceMapList = listOfMaps[pieceShape];

  const [pieceMap, setPieceMap] = useState<PieceMap>(pieceMapList[positionZ]);

  const style = {
    "--position-x": `${x}px`,
    "--position-y": `${y}px`,
  } as React.CSSProperties;

  function rotate() {
    const activePieceXSize = pieceMapList[positionZ].length;

    if (
      positionX + activePieceXSize <= boardColsNumber - 1 &&
      !isCollisionAgainstPiece(
        board,
        pieceMapList[positionZ],
        positionX,
        positionY,
        { incrementX: 1 }
      )
    ) {
      setPieceMap(pieceMapList[positionZ]);
    } else {
      if (
        !isCollisionAgainstPiece(
          board,
          pieceMapList[positionZ],
          positionX,
          positionY,
          {
            incrementX: -1,
          }
        )
      ) {
        setPieceMap(pieceMapList[positionZ]);
        onChange(pieceMap, positionX - 1, positionZ);
      }
    }
  }

  useEffect(() => {
    rotate();
  }, [positionZ]);

  useEffect(() => {
    onChange(pieceMap, positionX, positionZ);
  }, [pieceMap]);

  useEffect(() => {
    onChange(pieceMap, positionX, positionZ);
  }, []);

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
