import { blockSize } from "./../config";
import { X } from "../lib/piece";

import Block from "./Block";
import { useContext } from "react";
import { log } from "../log.js";
import { GameContext } from "../store/GameContext.js";

export default function ActivePiece() {
  log("<ActivePiece /> rendered", 4);

  const { activePiece, currentPieceMap } = useContext(GameContext);

  const x = activePiece.positionX * blockSize;
  const y = activePiece.positionY * blockSize;

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
        {currentPieceMap().map((row, rowIndex) => {
          return row.map((piece, colIndex) => {
            if (piece === X) {
              return (
                <Block
                  key={`${rowIndex}-${colIndex}`}
                  absolute
                  positionX={colIndex}
                  positionY={rowIndex}
                  type={activePiece.color}
                ></Block>
              );
            }
          });
        })}
      </div>
    </div>
  );
}
