import { PropsWithChildren, memo, useContext } from "react";

import { blockSize, boardColsNumber as colsNumber } from "../config";
import { log } from "../log.js";
import { GameContext } from "../store/GameContext.js";
import BoardBlocks from "./BoardBlocks.js";

export default function Board({ children }: PropsWithChildren) {
  log("<Board /> rendered", 2);

  const { board } = useContext(GameContext);

  const styleFrameSize = {
    "--block-size": `${blockSize}px`,
  } as React.CSSProperties;

  const styleBoardSize = {
    "--board-width": `${colsNumber * blockSize}px`,
  } as React.CSSProperties;

  const styleGridSize = {
    gridTemplateColumns: `repeat(${colsNumber}, minmax(0, 1fr))`,
  } as React.CSSProperties;

  return (
    <div
      className="absolute top-[var(--block-size)] left-[var(--block-size)]"
      style={styleFrameSize}
    >
      <div className="relative w-[var(--board-width)]" style={styleBoardSize}>
        {children}
        <div style={styleGridSize} className={`grid justify-start bg-black`}>
          <BoardBlocks board={board} />
        </div>
      </div>
    </div>
  );
}
