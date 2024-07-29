import { memo } from "react";
import { BoardType } from "../lib/board";
import Block from "./Block";
import { log } from "../log.js";

interface BoardBlocksProps {
  board: BoardType;
}

const BoardBlocks = memo(({ board }: BoardBlocksProps) => {
  log("<BoardBlocks /> rendered", 4);

  return board.map((row, y) => {
    return row.map((blockType, x) => {
      return <Block key={`${x}-${y}`} type={blockType} />;
    });
  });
});

export default BoardBlocks;
