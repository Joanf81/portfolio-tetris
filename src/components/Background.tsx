import { memo } from "react";
import {
  blockSize,
  boardRowsNumber as rowsNumber,
  boardColsNumber as colsNumber,
} from "../config";
import Block from "./Block";
import { log } from "../log.js";
import { BlockType } from "../lib/block.js";

const Background = memo(
  () => {
    log("<Background /> rendered", 2);

    const blocksPerRow = colsNumber + 2;
    const background: BlockType[][] = Array.from(
      { length: rowsNumber + 2 },
      (row, y) =>
        Array.from({ length: blocksPerRow }, (element, x) => {
          if (
            y === 0 ||
            y === rowsNumber + 1 ||
            x === 0 ||
            x === blocksPerRow - 1
          )
            return "border";
          else return "empty";
        })
    );

    const styleGridSize = {
      gridTemplateColumns: `repeat(${blocksPerRow}, minmax(0, 1fr))`,
    } as React.CSSProperties;

    const styleBackground = {
      "--board-width": `${blocksPerRow * blockSize}px`,
    } as React.CSSProperties;

    return (
      <div className="relative w-[var(--board-width)]" style={styleBackground}>
        <div style={styleGridSize} className={`grid justify-start bg-black`}>
          {background.map((row, y) => {
            return row.map((blockType, x) => {
              return <Block key={`${x}-${y}`} type={blockType} />;
            });
          })}
        </div>
      </div>
    );
  },
  () => true
);

export default Background;
